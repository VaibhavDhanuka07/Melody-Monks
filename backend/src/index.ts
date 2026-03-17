import cors from "cors";
import { Prisma } from "@prisma/client";
import dotenv from "dotenv";
import express from "express";
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  randomUUID,
  timingSafeEqual,
} from "crypto";
import { z } from "zod";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import jwt, { type JwtPayload } from "jsonwebtoken";
import speakeasy from "speakeasy";
import { metricsHandler, metricsMiddleware, recordCacheMetric } from "./lib/metrics.js";
import {
  buildPageInfo,
  buildPrismaPagination,
  parsePagination,
  slicePage,
} from "./lib/pagination.js";
import { cacheService } from "./services/cache.js";
import {
  type CompetitionSubmissionRecord,
  computeJudgeScore,
  getVoteCountMap,
  leaderboardCacheKey,
  mergeCompetitionScores,
  recomputeLeaderboardCache,
  submissionsCacheKey,
} from "./services/competition.js";
import { aiImageService } from "./services/aiImages.js";
import { generateAndStoreImage, type ImageEntity } from "./services/imageGeneration.js";
import { allowInMemoryFallbacks, prisma } from "./services/prisma.js";
import { queueService } from "./services/queue.js";
import { realtimeService } from "./services/realtime.js";
import { storageService, type UploadKind } from "./services/storage.js";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "./services/supabaseAdmin.js";

dotenv.config();

type AuthContext = {
  userId?: string | null;
  role: string;
  email?: string | null;
};

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

const app = express();
const PORT = process.env.PORT || 5001;

app.set("trust proxy", 1);
app.disable("x-powered-by");

const adminApiKey = process.env.ADMIN_API_KEY ?? "";
const jwtSecret = process.env.SUPABASE_JWT_SECRET ?? "";
const encryptionKey = process.env.ENCRYPTION_KEY ?? "";
const captchaSecret = process.env.CAPTCHA_SECRET ?? "";
const captchaProvider = (process.env.CAPTCHA_PROVIDER ?? "turnstile").toLowerCase();
const adminTotpSecret = process.env.ADMIN_2FA_SECRET ?? "";
const requireTwoFactor = process.env.REQUIRE_2FA === "true" && adminTotpSecret;
const authRequired = Boolean(jwtSecret || adminApiKey);
const requestLogSampleRate = Number(process.env.REQUEST_LOG_SAMPLE_RATE ?? "1");

if (!prisma && !allowInMemoryFallbacks) {
  throw new Error("DATABASE_URL is required when in-memory fallbacks are disabled.");
}

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
      : "*",
  })
);
app.use(express.json({ limit: "1mb" }));
app.use((req, res, next) => {
  const requestId = req.headers["x-request-id"] || randomUUID();
  res.setHeader("x-request-id", requestId);
  res.locals.requestId = requestId;
  next();
});
app.use(metricsMiddleware);

const enforceHttps = process.env.ENFORCE_HTTPS === "true";
app.use((req, res, next) => {
  if (!enforceHttps) return next();
  const proto = req.headers["x-forwarded-proto"];
  if (proto && proto !== "https") {
    return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
  }
  return next();
});

const resolveClientIp = (req: express.Request) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip;
};

const logSecurityEvent = (
  event: string,
  req: express.Request,
  extra: Record<string, unknown> = {}
) => {
  const payload = {
    event,
    time: new Date().toISOString(),
    path: req.path,
    method: req.method,
    ip: resolveClientIp(req),
    userId: req.auth?.userId ?? null,
    role: req.auth?.role ?? null,
    ...extra,
  };
  const line = JSON.stringify(payload);
  if (event.includes("failed") || event.includes("blocked")) {
    console.warn(line);
  } else {
    console.info(line);
  }
};

const normalizeEncryptionKey = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^[0-9a-fA-F]{64}$/.test(trimmed)) {
    return Buffer.from(trimmed, "hex");
  }
  try {
    const base64 = Buffer.from(trimmed, "base64");
    if (base64.length === 32) {
      return base64;
    }
  } catch {
    // ignore invalid base64
  }
  if (trimmed.length === 32) {
    return Buffer.from(trimmed);
  }
  return null;
};

const encryptionKeyBytes = normalizeEncryptionKey(encryptionKey);

const encryptValue = (value?: string | null) => {
  if (!value) return value ?? null;
  if (!encryptionKeyBytes) return value;
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKeyBytes, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `enc:v1:${iv.toString("base64")}:${tag.toString("base64")}:${encrypted.toString(
    "base64"
  )}`;
};

const decryptValue = (value?: string | null) => {
  if (!value) return value ?? null;
  if (!encryptionKeyBytes) return value;
  if (!value.startsWith("enc:v1:")) return value;
  const [, iv, tag, payload] = value.split(":");
  if (!iv || !tag || !payload) return value;
  try {
    const decipher = createDecipheriv(
      "aes-256-gcm",
      encryptionKeyBytes,
      Buffer.from(iv, "base64")
    );
    decipher.setAuthTag(Buffer.from(tag, "base64"));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(payload, "base64")),
      decipher.final(),
    ]);
    return decrypted.toString("utf8");
  } catch {
    return value;
  }
};

const compareSecrets = (candidate: string, secret: string) => {
  if (!candidate || !secret) return false;
  const candidateBuffer = Buffer.from(candidate);
  const secretBuffer = Buffer.from(secret);
  if (candidateBuffer.length !== secretBuffer.length) {
    return false;
  }
  return timingSafeEqual(candidateBuffer, secretBuffer);
};

const readBearerToken = (req: express.Request) => {
  const header = req.headers.authorization;
  if (!header) return null;
  const [type, token] = header.split(" ");
  if (type?.toLowerCase() !== "bearer" || !token) {
    return null;
  }
  return token;
};

const resolveRole = (payload: JwtPayload & Record<string, unknown>) => {
  const rawRole =
    (payload.role as string | undefined) ??
    (payload.app_metadata as Record<string, unknown> | undefined)?.role ??
    (payload.user_metadata as Record<string, unknown> | undefined)?.role ??
    (payload.user_role as string | undefined) ??
    "student";
  const normalized = String(rawRole).toLowerCase();
  if (normalized === "service_role") return "admin";
  if (normalized === "super_admin") return "admin";
  return normalized;
};

const getAuthFromRequest = (req: express.Request): AuthContext | null => {
  const adminKey = req.headers["x-admin-key"];
  if (typeof adminKey === "string" && adminApiKey && compareSecrets(adminKey, adminApiKey)) {
    return { role: "admin", userId: "admin" };
  }

  const token = readBearerToken(req);
  if (!token || !jwtSecret) return null;
  try {
    const decoded = jwt.verify(token, jwtSecret, {
      algorithms: ["HS256"],
    }) as JwtPayload & Record<string, unknown>;
    const userId =
      (typeof decoded.sub === "string" && decoded.sub) ||
      (typeof decoded.user_id === "string" && decoded.user_id) ||
      null;
    const email =
      (typeof decoded.email === "string" && decoded.email) ||
      (typeof decoded.user_email === "string" && decoded.user_email) ||
      null;
    return {
      userId,
      email,
      role: resolveRole(decoded),
    };
  } catch {
    return null;
  }
};

const verifyTwoFactor = (req: express.Request) => {
  if (!requireTwoFactor) return true;
  const token = req.headers["x-2fa-token"];
  if (typeof token !== "string") return false;
  return speakeasy.totp.verify({
    secret: adminTotpSecret,
    encoding: "base32",
    token,
    window: 1,
  });
};

const authorize =
  (roles?: string[]) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const auth = req.auth ?? getAuthFromRequest(req);
    if (!auth) {
      if (authRequired) {
        logSecurityEvent("auth_failed", req);
        return res.status(401).json({ error: "Authentication required" });
      }
      req.auth = { role: "guest" };
      return next();
    }

    if (roles && !roles.includes(auth.role)) {
      logSecurityEvent("auth_blocked", req, { requiredRoles: roles });
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    if (roles?.includes("admin") && !verifyTwoFactor(req)) {
      logSecurityEvent("2fa_failed", req);
      return res.status(401).json({ error: "Two-factor token required" });
    }

    req.auth = auth;
    return next();
  };

const attachAuthContext = (
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction
) => {
  const auth = getAuthFromRequest(req);
  if (auth) {
    req.auth = auth;
  }
  return next();
};

const auditWriteActions = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const isWrite = ["POST", "PUT", "DELETE"].includes(req.method);
  if (isWrite) {
    res.on("finish", () => {
      if (
        res.statusCode < 400 &&
        req.auth &&
        ["admin", "instructor"].includes(req.auth.role)
      ) {
        logSecurityEvent("admin_action", req, { statusCode: res.statusCode });
      }
    });
  }
  return next();
};

const honeypotTriggered = (payload: Record<string, unknown>) => {
  const baitFields = ["company", "website", "url", "botField"];
  return baitFields.some((field) => {
    const value = payload[field];
    return typeof value === "string" && value.trim().length > 0;
  });
};

const verifyCaptcha = async (token: string | undefined, req: express.Request) => {
  if (!captchaSecret) return { ok: true };
  if (!token) return { ok: false, reason: "missing" };
  const endpoint =
    captchaProvider === "recaptcha"
      ? "https://www.google.com/recaptcha/api/siteverify"
      : "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const body = new URLSearchParams({
    secret: captchaSecret,
    response: token,
  });
  const ip = resolveClientIp(req);
  if (ip) body.set("remoteip", ip);
  try {
    const response = await fetch(endpoint, { method: "POST", body });
    const data = (await response.json()) as { success?: boolean; ["error-codes"]?: string[] };
    return { ok: Boolean(data.success), reason: data["error-codes"]?.[0] };
  } catch {
    return { ok: false, reason: "network" };
  }
};

app.use(attachAuthContext);
app.use(auditWriteActions);
app.use((req, res, next) => {
  const startedAt = Date.now();
  res.on("finish", () => {
    if (Math.random() <= requestLogSampleRate) {
      console.info(
        JSON.stringify({
          event: "request_completed",
          time: new Date().toISOString(),
          requestId: res.locals.requestId,
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          durationMs: Date.now() - startedAt,
          userId: req.auth?.userId ?? null,
        })
      );
    }
    if (res.statusCode >= 400) {
      logSecurityEvent("request_failed", req, {
        statusCode: res.statusCode,
        requestId: res.locals.requestId,
      });
    }
  });
  next();
});

const sanitizeValue = (value: unknown): unknown => {
  if (typeof value === "string") {
    return value.replace(/[<>]/g, "").trim();
  }
  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeValue(entry));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, sanitizeValue(entry)])
    );
  }
  return value;
};

app.use((req, _res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }
  next();
});

const rateLimitEnabled = process.env.RATE_LIMIT_ENABLED !== "false";
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
const writeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});
const formLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

if (rateLimitEnabled) {
  app.use("/api", apiLimiter);
  app.use("/api/auth", loginLimiter);
  app.use("/api/bookings", formLimiter);
  app.use("/api/performance-submissions", formLimiter);
  app.use("/api/competition-submissions", formLimiter);
  app.use("/api/reviews/public", formLimiter);
  app.use("/api/talent-requests", formLimiter);
  app.use("/api/orders", formLimiter);
  app.use("/api/marketplace-reviews", formLimiter);
  app.use("/api", (req, res, next) => {
    if (["POST", "PUT", "DELETE"].includes(req.method)) {
      return writeLimiter(req, res, next);
    }
    return next();
  });
}

const cachePrefixes = [
  "/api/blog",
  "/api/reviews",
  "/api/tools",
  "/api/courses",
  "/api/instruments",
  "/api/modules",
  "/api/lessons",
  "/api/assignments",
  "/api/practice-exercises",
  "/api/competitions",
  "/api/services",
  "/api/talents",
];

app.use((req, res, next) => {
  if (
    req.method === "GET" &&
    cachePrefixes.some((prefix) => req.path.startsWith(prefix))
  ) {
    res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
  }
  next();
});

const inMemoryLeads: Array<Record<string, unknown>> = [];
const inMemoryPerformances: Array<Record<string, unknown>> = [];
const inMemoryBlogs: Array<Record<string, unknown>> = [];
const inMemoryReviews: Array<Record<string, unknown>> = [];
const inMemoryTools: Array<Record<string, unknown>> = [];
const inMemoryInstruments: Array<Record<string, unknown>> = [];
const inMemoryPracticeSessions: Array<Record<string, unknown>> = [];
const inMemoryPracticeFeedback: Array<Record<string, unknown>> = [];
const inMemoryModules: Array<Record<string, unknown>> = [];
const inMemoryLessons: Array<Record<string, unknown>> = [];
const inMemoryAssignments: Array<Record<string, unknown>> = [];
const inMemoryPracticeExercises: Array<Record<string, unknown>> = [];
const inMemoryCourses: Array<Record<string, unknown>> = [];
const inMemoryLessonProgress: Array<Record<string, unknown>> = [];
const inMemoryPracticeAnalyses: Array<Record<string, unknown>> = [];
const inMemoryPracticePlans: Array<Record<string, unknown>> = [];
const inMemoryCompetitions: Array<Record<string, unknown>> = [];
const inMemoryCompetitionSubmissions: Array<Record<string, unknown>> = [];
const inMemoryCompetitionVotes: Array<Record<string, unknown>> = [];
const inMemoryMarketplaceServices: Array<Record<string, unknown>> = [];
const inMemoryMarketplaceOrders: Array<Record<string, unknown>> = [];
const inMemoryMarketplaceReviews: Array<Record<string, unknown>> = [];
const inMemoryTalents: Array<Record<string, unknown>> = [];
const inMemoryTalentRequests: Array<Record<string, unknown>> = [];
const paymentIdempotencyCache = new Map<
  string,
  { paymentId: string; createdAt: number }
>();

const bookingSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z
    .string()
    .trim()
    .min(6)
    .max(20)
    .regex(/^[0-9+()\-.\s]+$/),
  instrument: z.string().trim().max(80).optional(),
  mode: z.string().trim().max(40).optional(),
  preferredTime: z.string().trim().max(120).optional(),
  company: z.string().trim().max(120).optional(),
  captchaToken: z.string().trim().optional(),
});

const performanceSchema = z.object({
  name: z.string().trim().min(2).max(80),
  title: z.string().trim().min(2).max(140),
  videoUrl: z.string().trim().url().max(2048),
  notes: z.string().trim().max(500).optional(),
  company: z.string().trim().max(120).optional(),
  captchaToken: z.string().trim().optional(),
});

const blogSchema = z.object({
  title: z.string().trim().min(3).max(140),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9-]+$/i),
  content: z.string().trim().min(10).max(20000),
  image: z.string().trim().max(500).optional(),
  imageUrl: z.string().trim().max(500).optional(),
  author: z.string().trim().min(2).max(80),
  category: z.string().trim().min(2).max(80),
});

const reviewSchema = z.object({
  studentName: z.string().trim().min(2).max(80),
  photo: z.string().trim().max(500).optional(),
  rating: z.coerce.number().min(1).max(5),
  reviewText: z.string().trim().min(5).max(500),
  program: z.string().trim().max(120).optional(),
  videoUrl: z.string().trim().max(500).optional(),
  company: z.string().trim().max(120).optional(),
  captchaToken: z.string().trim().optional(),
});

const toolSchema = z.object({
  instrument: z.string().trim().max(80).optional(),
  toolName: z.string().trim().min(2).max(80),
  description: z.string().trim().min(4).max(500),
  toolType: z.string().trim().min(2).max(80),
});

const instrumentSchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/i),
  description: z.string().trim().max(500).optional(),
  imageUrl: z.string().trim().max(500).optional(),
});

const courseSchema = z.object({
  title: z.string().trim().min(2).max(120),
  instrument: z.string().trim().max(80).optional(),
  description: z.string().trim().max(1000).optional(),
  level: z.string().trim().max(40).optional(),
  price: z.coerce.number().int().min(0).optional(),
  thumbnailUrl: z.string().trim().max(500).optional(),
});

const practiceSessionSchema = z.object({
  userId: z.string().uuid().optional(),
  practiceType: z.string().trim().min(2).max(80),
  duration: z.coerce.number().min(1).max(600).optional(),
  date: z.string().trim().optional(),
});

const practiceFeedbackSchema = z.object({
  userId: z.string().uuid().optional(),
  lessonId: z.string().uuid().optional(),
  feedback: z.string().trim().min(3).max(500),
  score: z.coerce.number().min(0).max(100).optional(),
});

const lessonProgressSchema = z.object({
  userId: z.string().uuid().optional(),
  lessonId: z.string().trim().min(1).max(120),
  completed: z.coerce.boolean().optional(),
  watchedTime: z.coerce.number().min(0).max(100000).optional(),
});

const practiceAnalysisSchema = z.object({
  userId: z.string().uuid().optional(),
  lessonId: z.string().trim().optional(),
  pitchScore: z.coerce.number().min(0).max(100).optional(),
  tempoScore: z.coerce.number().min(0).max(100).optional(),
  feedback: z.string().trim().max(1000).optional(),
});

const practicePlanSchema = z.object({
  userId: z.string().uuid().optional(),
  instrument: z.string().trim().min(2).max(80),
  planData: z.unknown(),
  date: z.string().trim().optional(),
});

const competitionSchema = z.object({
  instrument: z.string().trim().min(2).max(80),
  title: z.string().trim().min(3).max(140),
  description: z.string().trim().max(1000).optional(),
  startDate: z.string().trim().optional(),
  endDate: z.string().trim().optional(),
});

const competitionSubmissionSchema = z.object({
  competitionId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  instrument: z.string().trim().min(2).max(80),
  songTitle: z.string().trim().min(2).max(140),
  description: z.string().trim().max(1000).optional(),
  videoUrl: z.string().trim().url().max(2048),
  pitchScore: z.coerce.number().min(0).max(100).optional(),
  rhythmScore: z.coerce.number().min(0).max(100).optional(),
  techniqueScore: z.coerce.number().min(0).max(100).optional(),
  expressionScore: z.coerce.number().min(0).max(100).optional(),
  company: z.string().trim().max(120).optional(),
  captchaToken: z.string().trim().optional(),
});

const competitionVoteSchema = z.object({
  submissionId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
});

const marketplaceServiceSchema = z.object({
  title: z.string().trim().min(3).max(140),
  description: z.string().trim().min(10).max(2000),
  price: z.coerce.number().int().min(1),
  category: z.string().trim().min(2).max(80),
  deliveryTime: z.string().trim().min(2).max(80),
  sellerName: z.string().trim().max(80).optional(),
  sellerBio: z.string().trim().max(500).optional(),
  sellerImage: z.string().trim().max(500).optional(),
  portfolio: z.unknown().optional(),
});

const marketplaceOrderSchema = z.object({
  serviceId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  buyerName: z.string().trim().max(80).optional(),
  buyerEmail: z.string().trim().email().max(200).optional(),
  status: z.string().trim().max(40).optional(),
  amount: z.coerce.number().int().min(0).optional(),
});

const marketplaceReviewSchema = z.object({
  serviceId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  buyerName: z.string().trim().max(80).optional(),
  rating: z.coerce.number().min(1).max(5),
  reviewText: z.string().trim().min(3).max(500),
});

const talentRequestSchema = z.object({
  talentId: z.string().uuid().optional(),
  producerName: z.string().trim().min(2).max(80),
  contactEmail: z.string().trim().email().max(200),
  message: z.string().trim().min(5).max(1000),
  company: z.string().trim().max(120).optional(),
  captchaToken: z.string().trim().optional(),
});

const moduleSchema = z.object({
  courseId: z.string().uuid().optional(),
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1000).optional(),
  order: z.coerce.number().int().min(1),
  lessonCount: z.coerce.number().int().min(1).max(50).optional(),
  duration: z.string().trim().max(80).optional(),
});

const lessonSchema = z.object({
  moduleId: z.string().uuid().optional(),
  title: z.string().trim().min(2).max(120),
  videoUrl: z.string().trim().max(2048).optional(),
  notes: z.string().trim().max(2000).optional(),
  duration: z.string().trim().max(80).optional(),
  theory: z.string().trim().max(2000).optional(),
  pdfUrl: z.string().trim().max(2048).optional(),
});

const assignmentSchema = z.object({
  lessonId: z.string().uuid().optional(),
  title: z.string().trim().min(2).max(120),
  instructions: z.string().trim().min(4).max(2000),
  pdfUrl: z.string().trim().max(2048).optional(),
  dueDays: z.coerce.number().int().min(1).max(365).optional(),
});

const practiceExerciseSchema = z.object({
  lessonId: z.string().uuid().optional(),
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(4).max(2000),
  pdfUrl: z.string().trim().max(2048).optional(),
  duration: z.string().trim().max(80).optional(),
});

const paymentSchema = z.object({
  userId: z.string().uuid().optional(),
  amount: z.coerce.number().int().min(1),
  status: z.string().trim().min(2).max(40),
  method: z.string().trim().min(2).max(40),
  reference: z.string().trim().max(120).optional(),
});

const approvalSchema = z.object({
  approved: z.boolean(),
});

const uploadRequestSchema = z.object({
  kind: z.enum([
    "lesson-video",
    "performance-upload",
    "competition-upload",
    "profile-image",
    "resource",
    "course-image",
    "instrument-image",
    "blog-image",
  ]),
  fileName: z.string().trim().min(3).max(180),
  contentType: z.string().trim().min(3).max(120),
  fileSize: z.coerce.number().int().min(1).max(250 * 1024 * 1024),
});

const paginationDefaultLimit = 50;

const ensurePersistentStore = (res: express.Response) => {
  if (!prisma && !allowInMemoryFallbacks) {
    res.status(503).json({ error: "Database unavailable" });
    return false;
  }
  return true;
};

const buildPageResponse = <T extends { id: string }>(
  items: T[],
  limit: number,
  sort: string,
  enabled: boolean
) => {
  if (!enabled) {
    return {
      items,
      pageInfo: {
        hasNextPage: false,
        nextCursor: null,
        limit: items.length || limit,
        sort,
      },
    };
  }
  const pageInfo = buildPageInfo(items, limit, sort);
  return {
    items: pageInfo.hasNextPage ? items.slice(0, limit) : items,
    pageInfo,
  };
};

const asIdentifiedRecords = (records: Array<Record<string, unknown>>) =>
  records as unknown as Array<{ id: string } & Record<string, unknown>>;

const queueInvalidate = async (prefix: string) => {
  await cacheService.deleteByPrefix(prefix);
  await queueService.addJob("cache.invalidate", { prefix }, `cache:${prefix}`);
};

const scheduleImageGeneration = async (payload: {
  entity: ImageEntity;
  id: string;
  title?: string;
  instrument?: string;
  category?: string;
  slug?: string;
}) => {
  if (!prisma) {
    return;
  }
  if (!storageService.isConfigured() || !aiImageService.isConfigured()) {
    return;
  }
  const jobId = `image:${payload.entity}:${payload.id}`;
  if (queueService.isConfigured()) {
    await queueService.addJob("image.generate", payload, jobId);
    return;
  }
  if (process.env.AI_IMAGE_INLINE === "true") {
    try {
      await generateAndStoreImage(prisma, payload);
    } catch (error) {
      console.warn(
        JSON.stringify({
          event: "image_generate_failed",
          entity: payload.entity,
          id: payload.id,
          error: error instanceof Error ? error.message : "unknown_error",
        })
      );
    }
  }
};

const whatsappNumber = process.env.WHATSAPP_NUMBER || "91XXXXXXXXXX";
const whatsappMessage =
  process.env.WHATSAPP_MESSAGE ||
  "Hi, I want to book a free Indian music trial class.";
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  whatsappMessage
)}`;

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "melody-monks-api" });
});

app.get("/ready", async (_req, res) => {
  let databaseReady = allowInMemoryFallbacks;
  try {
    databaseReady = prisma ? Boolean(await prisma.$queryRaw`SELECT 1`) : allowInMemoryFallbacks;
  } catch {
    databaseReady = false;
  }
  const cacheReady = await cacheService.isReady();
  const queueReady = queueService.isConfigured() ? await queueService.isReady() : true;
  const storageReady = storageService.isConfigured()
    ? await storageService.isReady()
    : allowInMemoryFallbacks;
  const ready = Boolean(databaseReady) && cacheReady && queueReady && storageReady;

  if (!ready) {
    return res.status(503).json({
      status: "degraded",
      databaseReady: Boolean(databaseReady),
      cacheReady,
      queueReady,
      storageReady,
    });
  }

  return res.json({
    status: "ready",
    databaseReady: true,
    cacheReady,
    queueReady,
    storageReady,
  });
});

app.get("/metrics", metricsHandler);

app.post("/api/uploads/signed-url", authorize(), async (req, res) => {
  const parsed = uploadRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid upload request" });
  }

  const { kind, fileName, contentType, fileSize } = parsed.data;
  const allowedTypes: Record<UploadKind, string[]> = {
    "lesson-video": ["video/mp4", "video/quicktime"],
    "performance-upload": ["video/mp4", "video/quicktime"],
    "competition-upload": ["video/mp4", "video/quicktime"],
    "profile-image": ["image/jpeg", "image/png"],
    resource: ["application/pdf", "audio/mpeg"],
    "course-image": ["image/jpeg", "image/png", "image/webp"],
    "instrument-image": ["image/jpeg", "image/png", "image/webp"],
    "blog-image": ["image/jpeg", "image/png", "image/webp"],
  };
  const maxFileSizeByKind: Record<UploadKind, number> = {
    "lesson-video": 250 * 1024 * 1024,
    "performance-upload": 150 * 1024 * 1024,
    "competition-upload": 150 * 1024 * 1024,
    "profile-image": 10 * 1024 * 1024,
    resource: 25 * 1024 * 1024,
    "course-image": 8 * 1024 * 1024,
    "instrument-image": 8 * 1024 * 1024,
    "blog-image": 8 * 1024 * 1024,
  };

  if (!allowedTypes[kind].includes(contentType) || fileSize > maxFileSizeByKind[kind]) {
    return res.status(400).json({ error: "Unsupported file type or size" });
  }

  try {
    const upload = await storageService.createSignedUpload({
      kind,
      fileName,
      contentType,
      userId: req.auth?.userId ?? null,
    });
    await queueService.addJob(
      "upload.process",
      {
        bucket: upload.bucket,
        path: upload.path,
        kind,
      },
      `upload:${upload.bucket}:${upload.path}`
    );
    return res.json(upload);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to create upload authorization",
    });
  }
});

app.post("/api/bookings", async (req, res) => {
  if (!ensurePersistentStore(res)) return;
  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid booking data" });
  }

  if (honeypotTriggered(parsed.data as Record<string, unknown>)) {
    logSecurityEvent("spam_blocked", req, { context: "booking" });
    return res.status(400).json({ error: "Spam detected" });
  }
  const captchaResult = await verifyCaptcha(parsed.data.captchaToken, req);
  if (!captchaResult.ok) {
    logSecurityEvent("captcha_failed", req, { context: "booking" });
    return res.status(400).json({ error: "Captcha validation failed" });
  }

  const { name, phone, instrument, mode, preferredTime } = parsed.data;
  const encryptedPhone = encryptValue(phone);

  if (prisma) {
    await prisma.trialLead.create({
      data: {
        name,
        phone: encryptedPhone || phone,
        instrument: instrument || "Hindustani Classical Vocal",
        mode: mode || "Online",
        preferredTime: preferredTime || null,
      },
    });
  } else {
    inMemoryLeads.push({
      name,
      phone: encryptedPhone || phone,
      instrument,
      mode,
      preferredTime,
    });
  }

  logSecurityEvent("booking_created", req, { name });
  return res.json({ ok: true, whatsappLink });
});

app.get(
  "/api/performance-submissions",
  authorize(["admin", "instructor"]),
  async (req, res) => {
  const pagination = parsePagination(req.query, "createdAt_desc", paginationDefaultLimit);
  if (prisma) {
    const submissions = await prisma.performanceSubmission.findMany({
      orderBy: { createdAt: pagination.sort === "createdAt_asc" ? "asc" : "desc" },
      ...buildPrismaPagination(pagination),
    });
    const page = buildPageResponse(
      submissions,
      pagination.limit,
      pagination.sort,
      pagination.enabled
    );
    return res.json({ submissions: page.items, pageInfo: page.pageInfo });
  }

  const page = slicePage(
    inMemoryPerformances as Array<{ id: string } & Record<string, unknown>>,
    pagination
  );
  return res.json({ submissions: page.items, pageInfo: page.pageInfo });
});

app.post("/api/performance-submissions", authorize(), async (req, res) => {
  const parsed = performanceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid performance data" });
  }

  if (honeypotTriggered(parsed.data as Record<string, unknown>)) {
    logSecurityEvent("spam_blocked", req, { context: "performance" });
    return res.status(400).json({ error: "Spam detected" });
  }
  const captchaResult = await verifyCaptcha(parsed.data.captchaToken, req);
  if (!captchaResult.ok) {
    logSecurityEvent("captcha_failed", req, { context: "performance" });
    return res.status(400).json({ error: "Captcha validation failed" });
  }

  const { name, title, videoUrl, notes } = parsed.data;
  const userId = req.auth?.userId ?? null;

  if (prisma) {
    await prisma.performanceSubmission.create({
      data: { name, title, videoUrl, notes: notes || null, userId },
    });
  } else {
    inMemoryPerformances.unshift({
      id: randomUUID(),
      name,
      title,
      videoUrl,
      notes,
      userId,
      createdAt: new Date().toISOString(),
    });
  }

  logSecurityEvent("performance_submitted", req, { title });
  return res.json({ ok: true });
});

app.get("/api/blog", async (req, res) => {
  const search = typeof req.query.search === "string" ? req.query.search : "";
  const category =
    typeof req.query.category === "string" ? req.query.category : "";
  const pagination = parsePagination(req.query, "createdAt_desc", paginationDefaultLimit);
  const orderBy = {
    createdAt: pagination.sort === "createdAt_asc" ? "asc" : "desc",
  } as const;
  const cacheKey = `blog:list:${category || "all"}:${search || "all"}:${pagination.cursor || "first"}:${pagination.limit}:${pagination.sort}`;

  if (prisma) {
    const db = prisma;
    const response = await cacheService.wrap(cacheKey, 300, async () => {
      recordCacheMetric("miss");
      const where: Record<string, unknown> = {};
      if (category) {
        where.category = category;
      }
      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
          { author: { contains: search, mode: "insensitive" } },
        ];
      }

      const posts = await db.blogPost.findMany({
        where,
        orderBy,
        ...buildPrismaPagination(pagination),
      });
      const page = buildPageResponse(posts, pagination.limit, pagination.sort, pagination.enabled);
      return { posts: page.items, pageInfo: page.pageInfo };
    });
    recordCacheMetric("hit");
    return res.json(response);
  }

  const filtered = inMemoryBlogs.filter((post) => {
    const postCategory = String(post.category || "");
    const matchesCategory = category ? postCategory === category : true;
    const haystack = `${post.title ?? ""} ${post.content ?? ""} ${
      post.author ?? ""
    }`.toLowerCase();
    const matchesSearch = search ? haystack.includes(search.toLowerCase()) : true;
    return matchesCategory && matchesSearch;
  });

  const page = slicePage(filtered as Array<{ id: string } & Record<string, unknown>>, pagination);
  return res.json({ posts: page.items, pageInfo: page.pageInfo });
});

app.get("/api/blog/:slug", async (req, res) => {
  const { slug } = req.params;
  if (prisma) {
    const cacheKey = `blog:slug:${slug}`;
    const cached = await cacheService.get<{ post: Record<string, unknown> }>(cacheKey);
    if (cached) {
      recordCacheMetric("hit");
      return res.json(cached);
    }
    recordCacheMetric("miss");
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const payload = { post };
    await cacheService.set(cacheKey, payload, 600);
    return res.json(payload);
  }

  const post = inMemoryBlogs.find((item) => item.slug === slug);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  return res.json({ post });
});

app.post("/api/blog", authorize(["admin"]), async (req, res) => {
  const parsed = blogSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid blog data" });
  }

  if (prisma) {
    const normalized = {
      ...parsed.data,
      image: parsed.data.image ?? parsed.data.imageUrl ?? null,
    };
    const post = await prisma.blogPost.create({ data: normalized });
    await queueInvalidate("blog:");
    if (!parsed.data.image && !parsed.data.imageUrl) {
      await scheduleImageGeneration({
        entity: "blog",
        id: post.id,
        title: post.title,
        category: post.category,
        slug: post.slug,
      });
    }
    return res.json({ post });
  }

  const post = {
    id: randomUUID(),
    ...parsed.data,
    image: parsed.data.image ?? parsed.data.imageUrl ?? null,
    createdAt: new Date().toISOString(),
  };
  inMemoryBlogs.unshift(post);
  return res.json({ post });
});

app.put("/api/blog/:id", authorize(["admin"]), async (req, res) => {
  const parsed = blogSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid blog data" });
  }

  const { id } = req.params;
  if (prisma) {
    const normalized = {
      ...parsed.data,
      image: parsed.data.image ?? parsed.data.imageUrl ?? null,
    };
    const post = await prisma.blogPost.update({
      where: { id },
      data: normalized,
    });
    await queueInvalidate("blog:");
    return res.json({ post });
  }

  const index = inMemoryBlogs.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Post not found" });
  }
  inMemoryBlogs[index] = { ...inMemoryBlogs[index], ...parsed.data };
  return res.json({ post: inMemoryBlogs[index] });
});

app.delete("/api/blog/:id", authorize(["admin"]), async (req, res) => {
  const { id } = req.params;
  if (prisma) {
    await prisma.blogPost.delete({ where: { id } });
    await queueInvalidate("blog:");
    return res.json({ ok: true });
  }
  const index = inMemoryBlogs.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Post not found" });
  }
  inMemoryBlogs.splice(index, 1);
  return res.json({ ok: true });
});

app.get("/api/reviews", async (req, res) => {
  const pagination = parsePagination(req.query, "createdAt_desc", paginationDefaultLimit);
  if (prisma) {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: pagination.sort === "createdAt_asc" ? "asc" : "desc" },
      ...buildPrismaPagination(pagination),
    });
    const page = buildPageResponse(reviews, pagination.limit, pagination.sort, pagination.enabled);
    return res.json({ reviews: page.items, pageInfo: page.pageInfo });
  }

  const page = slicePage(inMemoryReviews as Array<{ id: string } & Record<string, unknown>>, pagination);
  return res.json({ reviews: page.items, pageInfo: page.pageInfo });
});

app.post("/api/reviews/public", async (req, res) => {
  if (!ensurePersistentStore(res)) return;
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid review data" });
  }

  if (honeypotTriggered(parsed.data as Record<string, unknown>)) {
    logSecurityEvent("spam_blocked", req, { context: "review" });
    return res.status(400).json({ error: "Spam detected" });
  }
  const captchaResult = await verifyCaptcha(parsed.data.captchaToken, req);
  if (!captchaResult.ok) {
    logSecurityEvent("captcha_failed", req, { context: "review" });
    return res.status(400).json({ error: "Captcha validation failed" });
  }

  const { studentName, photo, rating, reviewText, videoUrl, program } = parsed.data;
  const payload = {
    studentName,
    photo: photo || null,
    rating,
    reviewText,
    videoUrl: videoUrl || null,
    program: program || "General",
  };

  if (prisma) {
    const review = await prisma.review.create({ data: payload });
    await queueInvalidate("reviews:");
    return res.json({ review });
  }

  const review = {
    id: randomUUID(),
    ...payload,
    createdAt: new Date().toISOString(),
  };
  inMemoryReviews.unshift(review);
  return res.json({ review });
});

app.post("/api/reviews", authorize(["admin"]), async (req, res) => {
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid review data" });
  }

  if (prisma) {
    const { studentName, photo, rating, reviewText, videoUrl, program } = parsed.data;
    const review = await prisma.review.create({
      data: {
        studentName,
        photo: photo || null,
        rating,
        reviewText,
        videoUrl: videoUrl || null,
        program: program || null,
      },
    });
    await queueInvalidate("reviews:");
    return res.json({ review });
  }

  const review = {
    id: randomUUID(),
    ...parsed.data,
    createdAt: new Date().toISOString(),
  };
  inMemoryReviews.unshift(review);
  return res.json({ review });
});

app.put("/api/reviews/:id", authorize(["admin"]), async (req, res) => {
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid review data" });
  }

  const { id } = req.params;
  if (prisma) {
    const { studentName, photo, rating, reviewText, videoUrl, program } = parsed.data;
    const review = await prisma.review.update({
      where: { id },
      data: {
        studentName,
        photo: photo || null,
        rating,
        reviewText,
        videoUrl: videoUrl || null,
        program: program || null,
      },
    });
    await queueInvalidate("reviews:");
    return res.json({ review });
  }

  const index = inMemoryReviews.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Review not found" });
  }
  inMemoryReviews[index] = { ...inMemoryReviews[index], ...parsed.data };
  return res.json({ review: inMemoryReviews[index] });
});

app.delete("/api/reviews/:id", authorize(["admin"]), async (req, res) => {
  const { id } = req.params;
  if (prisma) {
    await prisma.review.delete({ where: { id } });
    await queueInvalidate("reviews:");
    return res.json({ ok: true });
  }
  const index = inMemoryReviews.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Review not found" });
  }
  inMemoryReviews.splice(index, 1);
  return res.json({ ok: true });
});

app.get("/api/tools", async (req, res) => {
  const instrument =
    typeof req.query.instrument === "string" ? req.query.instrument : "";
  const toolType = typeof req.query.toolType === "string" ? req.query.toolType : "";
  const pagination = parsePagination(req.query, "createdAt_desc", paginationDefaultLimit);
  const cacheKey = `tools:instrument:${instrument || "all"}:${toolType || "all"}:${pagination.cursor || "first"}:${pagination.limit}:${pagination.sort}`;

  if (prisma) {
    const db = prisma;
    const response = await cacheService.wrap(cacheKey, 300, async () => {
      recordCacheMetric("miss");
      const tools = await db.tool.findMany({
        where: {
          ...(instrument ? { instrument } : {}),
          ...(toolType ? { toolType } : {}),
        },
        orderBy: { createdAt: pagination.sort === "createdAt_asc" ? "asc" : "desc" },
        ...buildPrismaPagination(pagination),
      });
      const page = buildPageResponse(tools, pagination.limit, pagination.sort, pagination.enabled);
      return { tools: page.items, pageInfo: page.pageInfo };
    });
    recordCacheMetric("hit");
    return res.json(response);
  }

  const filtered = inMemoryTools.filter((tool) => {
    const matchesInstrument = instrument ? tool.instrument === instrument : true;
    const matchesType = toolType ? tool.toolType === toolType : true;
    return matchesInstrument && matchesType;
  });
  const page = slicePage(filtered as Array<{ id: string } & Record<string, unknown>>, pagination);
  return res.json({ tools: page.items, pageInfo: page.pageInfo });
});

app.get("/api/instruments", async (req, res) => {
  const search = typeof req.query.search === "string" ? req.query.search : "";
  const pagination = parsePagination(req.query, "createdAt_desc", paginationDefaultLimit);
  const cacheKey = `instruments:list:${search || "all"}:${pagination.cursor || "first"}:${pagination.limit}:${pagination.sort}`;

  if (prisma) {
    const db = prisma;
    const response = await cacheService.wrap(cacheKey, 300, async () => {
      recordCacheMetric("miss");
      const where: Prisma.InstrumentWhereInput | undefined = search
        ? {
            OR: [
              { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
              {
                description: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : undefined;
      const instruments = await db.instrument.findMany({
        where,
        orderBy: { createdAt: pagination.sort === "createdAt_asc" ? "asc" : "desc" },
        ...buildPrismaPagination(pagination),
      });
      const page = buildPageResponse(instruments, pagination.limit, pagination.sort, pagination.enabled);
      return { instruments: page.items, pageInfo: page.pageInfo };
    });
    recordCacheMetric("hit");
    return res.json(response);
  }

  const filtered = inMemoryInstruments.filter((item) => {
    if (!search) return true;
    const haystack = `${item.name ?? ""} ${item.description ?? ""}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  });
  const page = slicePage(filtered as Array<{ id: string } & Record<string, unknown>>, pagination);
  return res.json({ instruments: page.items, pageInfo: page.pageInfo });
});

app.post("/api/instruments", authorize(["admin", "instructor"]), async (req, res) => {
  const parsed = instrumentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid instrument data" });
  }

  if (prisma) {
    const instrument = await prisma.instrument.create({ data: parsed.data });
    await queueInvalidate("instruments:list:");
    if (!parsed.data.imageUrl) {
      await scheduleImageGeneration({
        entity: "instrument",
        id: instrument.id,
        title: instrument.name,
        slug: instrument.slug,
      });
    }
    return res.json({ instrument });
  }

  const instrument = {
    id: randomUUID(),
    ...parsed.data,
    createdAt: new Date().toISOString(),
  };
  inMemoryInstruments.unshift(instrument);
  return res.json({ instrument });
});

app.put("/api/instruments/:id", authorize(["admin", "instructor"]), async (req, res) => {
  const parsed = instrumentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid instrument data" });
  }

  const { id } = req.params;
  if (prisma) {
    const instrument = await prisma.instrument.update({
      where: { id },
      data: parsed.data,
    });
    await queueInvalidate("instruments:list:");
    return res.json({ instrument });
  }

  const index = inMemoryInstruments.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Instrument not found" });
  }
  inMemoryInstruments[index] = { ...inMemoryInstruments[index], ...parsed.data };
  return res.json({ instrument: inMemoryInstruments[index] });
});

app.delete("/api/instruments/:id", authorize(["admin", "instructor"]), async (req, res) => {
  const { id } = req.params;
  if (prisma) {
    await prisma.instrument.delete({ where: { id } });
    await queueInvalidate("instruments:list:");
    return res.json({ ok: true });
  }

  const index = inMemoryInstruments.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Instrument not found" });
  }
  inMemoryInstruments.splice(index, 1);
  return res.json({ ok: true });
});

app.get("/api/courses", async (req, res) => {
  const instrument =
    typeof req.query.instrument === "string" ? req.query.instrument : "";
  const level = typeof req.query.level === "string" ? req.query.level : "";
  const pagination = parsePagination(req.query, "createdAt_desc", paginationDefaultLimit);
  const cacheKey = `courses:list:${instrument || "all"}:${level || "all"}:${pagination.cursor || "first"}:${pagination.limit}:${pagination.sort}`;
  if (prisma) {
    const db = prisma;
    const response = await cacheService.wrap(cacheKey, 300, async () => {
      recordCacheMetric("miss");
      const courses = await db.course.findMany({
        where: {
          ...(instrument ? { instrument } : {}),
          ...(level ? { level } : {}),
        },
        orderBy: { createdAt: pagination.sort === "createdAt_asc" ? "asc" : "desc" },
        ...buildPrismaPagination(pagination),
      });
      const page = buildPageResponse(courses, pagination.limit, pagination.sort, pagination.enabled);
      return { courses: page.items, pageInfo: page.pageInfo };
    });
    recordCacheMetric("hit");
    return res.json(response);
  }

  const filtered = inMemoryCourses.filter((course) => {
    const matchesInstrument = instrument ? course.instrument === instrument : true;
    const matchesLevel = level ? course.level === level : true;
    return matchesInstrument && matchesLevel;
  });
  const page = slicePage(filtered as Array<{ id: string } & Record<string, unknown>>, pagination);
  return res.json({ courses: page.items, pageInfo: page.pageInfo });
});

app.post("/api/courses", authorize(["admin", "instructor"]), async (req, res) => {
  const parsed = courseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid course data" });
  }

  if (prisma) {
    const course = await prisma.course.create({ data: parsed.data });
    await queueInvalidate("courses:list:");
    if (!parsed.data.thumbnailUrl) {
      await scheduleImageGeneration({
        entity: "course",
        id: course.id,
        title: course.title,
        instrument: course.instrument ?? undefined,
      });
    }
    return res.json({ course });
  }

  const course = {
    id: randomUUID(),
    ...parsed.data,
    createdAt: new Date().toISOString(),
  };
  inMemoryCourses.unshift(course);
  return res.json({ course });
});

app.put("/api/courses/:id", authorize(["admin", "instructor"]), async (req, res) => {
  const parsed = courseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid course data" });
  }

  const { id } = req.params;
  if (prisma) {
    const course = await prisma.course.update({
      where: { id },
      data: parsed.data,
    });
    await queueInvalidate("courses:list:");
    return res.json({ course });
  }

  const index = inMemoryCourses.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Course not found" });
  }
  inMemoryCourses[index] = { ...inMemoryCourses[index], ...parsed.data };
  return res.json({ course: inMemoryCourses[index] });
});

app.delete("/api/courses/:id", authorize(["admin", "instructor"]), async (req, res) => {
  const { id } = req.params;
  if (prisma) {
    await prisma.course.delete({ where: { id } });
    await queueInvalidate("courses:list:");
    return res.json({ ok: true });
  }

  const index = inMemoryCourses.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Course not found" });
  }
  inMemoryCourses.splice(index, 1);
  return res.json({ ok: true });
});

app.post("/api/tools", authorize(["admin"]), async (req, res) => {
  const parsed = toolSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid tool data" });
  }

  if (prisma) {
    const tool = await prisma.tool.create({
      data: {
        ...parsed.data,
        instrument: parsed.data.instrument || "General",
      },
    });
    await queueInvalidate("tools:instrument:");
    return res.json({ tool });
  }

  const tool = {
    id: randomUUID(),
    ...parsed.data,
    instrument: parsed.data.instrument || "General",
    createdAt: new Date().toISOString(),
  };
  inMemoryTools.unshift(tool);
  return res.json({ tool });
});

app.put("/api/tools/:id", authorize(["admin"]), async (req, res) => {
  const parsed = toolSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid tool data" });
  }

  const { id } = req.params;
  if (prisma) {
    const tool = await prisma.tool.update({
      where: { id },
      data: {
        ...parsed.data,
        instrument: parsed.data.instrument || "General",
      },
    });
    await queueInvalidate("tools:instrument:");
    return res.json({ tool });
  }

  const index = inMemoryTools.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Tool not found" });
  }
  inMemoryTools[index] = {
    ...inMemoryTools[index],
    ...parsed.data,
    instrument: parsed.data.instrument || "General",
  };
  return res.json({ tool: inMemoryTools[index] });
});

app.delete("/api/tools/:id", authorize(["admin"]), async (req, res) => {
  const { id } = req.params;
  if (prisma) {
    await prisma.tool.delete({ where: { id } });
    await queueInvalidate("tools:instrument:");
    return res.json({ ok: true });
  }
  const index = inMemoryTools.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Tool not found" });
  }
  inMemoryTools.splice(index, 1);
  return res.json({ ok: true });
});

app.post("/api/payments/checkout", async (_req, res) => {
  return res.json({
    checkoutUrl: "https://checkout.stripe.com/pay/placeholder",
  });
});

app.get("/api/practice-sessions", async (req, res) => {
  const userId = typeof req.query.userId === "string" ? req.query.userId : "";
  const pagination = parsePagination(req.query, "createdAt_desc", paginationDefaultLimit);
  if (prisma) {
    const sessions = await prisma.practiceSession.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: pagination.sort === "createdAt_asc" ? "asc" : "desc" },
      ...buildPrismaPagination(pagination),
    });
    const page = buildPageResponse(sessions, pagination.limit, pagination.sort, pagination.enabled);
    return res.json({ sessions: page.items, pageInfo: page.pageInfo });
  }

  const filtered = userId
    ? inMemoryPracticeSessions.filter((item) => item.userId === userId)
    : inMemoryPracticeSessions;
  const page = slicePage(filtered as Array<{ id: string } & Record<string, unknown>>, pagination);
  return res.json({ sessions: page.items, pageInfo: page.pageInfo });
});

app.post("/api/practice-sessions", async (req, res) => {
  const parsed = practiceSessionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid practice session data" });
  }

  const { userId, practiceType, duration, date } = parsed.data;

  if (prisma) {
    const session = await prisma.practiceSession.create({
      data: {
        userId: userId || null,
        practiceType,
        duration: duration ?? null,
        date: date ? new Date(date) : null,
      },
    });
    return res.json({ session });
  }

  const session = {
    id: randomUUID(),
    userId,
    practiceType,
    duration,
    date: date || new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  inMemoryPracticeSessions.unshift(session);
  return res.json({ session });
});

app.get("/api/practice-feedback", async (req, res) => {
  const userId = typeof req.query.userId === "string" ? req.query.userId : "";
  const lessonId = typeof req.query.lessonId === "string" ? req.query.lessonId : "";
  const pagination = parsePagination(req.query, "createdAt_desc", paginationDefaultLimit);
  if (prisma) {
    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (lessonId) where.lessonId = lessonId;
    const feedback = await prisma.practiceFeedback.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy: { createdAt: pagination.sort === "createdAt_asc" ? "asc" : "desc" },
      ...buildPrismaPagination(pagination),
    });
    const page = buildPageResponse(
      feedback,
      pagination.limit,
      pagination.sort,
      pagination.enabled
    );
    return res.json({ feedback: page.items, pageInfo: page.pageInfo });
  }

  const filtered = inMemoryPracticeFeedback.filter((entry) => {
    const matchesUser = userId ? entry.userId === userId : true;
    const matchesLesson = lessonId ? entry.lessonId === lessonId : true;
    return matchesUser && matchesLesson;
  });
  const page = slicePage(
    filtered as Array<{ id: string } & Record<string, unknown>>,
    pagination
  );
  return res.json({ feedback: page.items, pageInfo: page.pageInfo });
});

app.post("/api/practice-feedback", async (req, res) => {
  const parsed = practiceFeedbackSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid practice feedback data" });
  }

  const { userId, lessonId, feedback, score } = parsed.data;

  if (prisma) {
    const entry = await prisma.practiceFeedback.create({
      data: {
        userId: userId || null,
        lessonId: lessonId || null,
        feedback,
        score: score ?? null,
      },
    });
    return res.json({ feedback: entry });
  }

  const entry = {
    id: randomUUID(),
    userId,
    lessonId,
    feedback,
    score,
    createdAt: new Date().toISOString(),
  };
  inMemoryPracticeFeedback.unshift(entry);
  return res.json({ feedback: entry });
});

app.get("/api/lesson-progress", async (req, res) => {
  const userId = typeof req.query.userId === "string" ? req.query.userId : "";
  const lessonId = typeof req.query.lessonId === "string" ? req.query.lessonId : "";
  const pagination = parsePagination(req.query, "updatedAt_desc", paginationDefaultLimit);

  if (prisma) {
    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (lessonId) where.lessonId = lessonId;
    const progress = await prisma.lessonProgress.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy: { updatedAt: pagination.sort === "updatedAt_asc" ? "asc" : "desc" },
      ...buildPrismaPagination({
        ...pagination,
        sort:
          pagination.sort === "updatedAt_asc" || pagination.sort === "updatedAt_desc"
            ? pagination.sort
            : "updatedAt_desc",
      }),
    });
    const page = buildPageResponse(
      progress,
      pagination.limit,
      pagination.sort,
      pagination.enabled
    );
    return res.json({ progress: page.items, pageInfo: page.pageInfo });
  }

  const filtered = inMemoryLessonProgress.filter((entry) => {
    const matchesUser = userId ? entry.userId === userId : true;
    const matchesLesson = lessonId ? entry.lessonId === lessonId : true;
    return matchesUser && matchesLesson;
  });
  const page = slicePage(
    filtered as Array<{ id: string } & Record<string, unknown>>,
    pagination
  );
  return res.json({ progress: page.items, pageInfo: page.pageInfo });
});

app.post("/api/lesson-progress", async (req, res) => {
  const parsed = lessonProgressSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid lesson progress data" });
  }

  const { userId, lessonId, completed, watchedTime } = parsed.data;
  const completedValue = completed ?? false;
  const watchedValue = watchedTime ?? null;

  if (prisma) {
    const existing = await prisma.lessonProgress.findFirst({
      where: {
        lessonId,
        userId: userId || null,
      },
    });
    if (existing) {
      const updated = await prisma.lessonProgress.update({
        where: { id: existing.id },
        data: {
          completed: completedValue,
          watchedTime: watchedValue,
        },
      });
      return res.json({ progress: updated });
    }

    const progress = await prisma.lessonProgress.create({
      data: {
        userId: userId || null,
        lessonId,
        completed: completedValue,
        watchedTime: watchedValue,
      },
    });
    return res.json({ progress });
  }

  const existingIndex = inMemoryLessonProgress.findIndex(
    (entry) => entry.lessonId === lessonId && entry.userId === userId
  );
  if (existingIndex !== -1) {
    inMemoryLessonProgress[existingIndex] = {
      ...inMemoryLessonProgress[existingIndex],
      completed: completedValue,
      watchedTime: watchedValue,
      updatedAt: new Date().toISOString(),
    };
    return res.json({ progress: inMemoryLessonProgress[existingIndex] });
  }

  const entry = {
    id: randomUUID(),
    userId,
    lessonId,
    completed: completedValue,
    watchedTime: watchedValue,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  inMemoryLessonProgress.unshift(entry);
  return res.json({ progress: entry });
});

app.get("/api/practice-analysis", async (req, res) => {
  const userId = typeof req.query.userId === "string" ? req.query.userId : "";
  const lessonId =
    typeof req.query.lessonId === "string" ? req.query.lessonId : "";
  const pagination = parsePagination(req.query, "createdAt_desc", paginationDefaultLimit);

  if (prisma) {
    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (lessonId) where.lessonId = lessonId;
    const analyses = await prisma.practiceAnalysis.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy: { createdAt: pagination.sort === "createdAt_asc" ? "asc" : "desc" },
      ...buildPrismaPagination(pagination),
    });
    const page = buildPageResponse(
      analyses,
      pagination.limit,
      pagination.sort,
      pagination.enabled
    );
    return res.json({ analyses: page.items, pageInfo: page.pageInfo });
  }

  const filtered = inMemoryPracticeAnalyses.filter((entry) => {
    const matchesUser = userId ? entry.userId === userId : true;
    const matchesLesson = lessonId ? entry.lessonId === lessonId : true;
    return matchesUser && matchesLesson;
  });
  const page = slicePage(
    filtered as Array<{ id: string } & Record<string, unknown>>,
    pagination
  );
  return res.json({ analyses: page.items, pageInfo: page.pageInfo });
});

app.post("/api/practice-analysis", async (req, res) => {
  const parsed = practiceAnalysisSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid practice analysis data" });
  }

  const { userId, lessonId, pitchScore, tempoScore, feedback } = parsed.data;

  if (prisma) {
    const analysis = await prisma.practiceAnalysis.create({
      data: {
        userId: userId || null,
        lessonId: lessonId || null,
        pitchScore: pitchScore ?? null,
        tempoScore: tempoScore ?? null,
        feedback: feedback ?? null,
      },
    });
    return res.json({ analysis });
  }

  const entry = {
    id: randomUUID(),
    userId,
    lessonId,
    pitchScore,
    tempoScore,
    feedback,
    createdAt: new Date().toISOString(),
  };
  inMemoryPracticeAnalyses.unshift(entry);
  return res.json({ analysis: entry });
});

app.get("/api/practice-plans", async (req, res) => {
  const userId = typeof req.query.userId === "string" ? req.query.userId : "";
  const instrument =
    typeof req.query.instrument === "string" ? req.query.instrument : "";
  const date = typeof req.query.date === "string" ? req.query.date : "";
  const pagination = parsePagination(req.query, "date_desc", paginationDefaultLimit);

  const buildDateFilter = () => {
    if (!date) return undefined;
    const start = new Date(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);
    return { gte: start, lt: end };
  };

  if (prisma) {
    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (instrument) where.instrument = instrument;
    const dateFilter = buildDateFilter();
    if (dateFilter) where.date = dateFilter;
    const plans = await prisma.practicePlan.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy: { date: pagination.sort === "date_asc" ? "asc" : "desc" },
      ...buildPrismaPagination({
        ...pagination,
        sort:
          pagination.sort === "date_asc" || pagination.sort === "date_desc"
            ? pagination.sort
            : "date_desc",
      }),
    });
    const page = buildPageResponse(
      plans,
      pagination.limit,
      pagination.sort,
      pagination.enabled
    );
    return res.json({ plans: page.items, pageInfo: page.pageInfo });
  }

  const filtered = inMemoryPracticePlans.filter((entry) => {
    const matchesUser = userId ? entry.userId === userId : true;
    const matchesInstrument = instrument ? entry.instrument === instrument : true;
    const matchesDate = date
      ? String(entry.date || "").slice(0, 10) === date
      : true;
    return matchesUser && matchesInstrument && matchesDate;
  });
  const page = slicePage(
    filtered as Array<{ id: string } & Record<string, unknown>>,
    pagination
  );
  return res.json({ plans: page.items, pageInfo: page.pageInfo });
});

app.post("/api/practice-plans", async (req, res) => {
  const parsed = practicePlanSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid practice plan data" });
  }

  const { userId, instrument, planData, date } = parsed.data;
  const planDate = date ? new Date(date) : new Date();

  if (prisma) {
    const plan = await prisma.practicePlan.create({
      data: {
        userId: userId || null,
        instrument,
        planData: planData as Prisma.InputJsonValue,
        date: planDate,
      },
    });
    return res.json({ plan });
  }

  const entry = {
    id: randomUUID(),
    userId,
    instrument,
    planData,
    date: planDate.toISOString(),
    createdAt: new Date().toISOString(),
  };
  inMemoryPracticePlans.unshift(entry);
  return res.json({ plan: entry });
});

app.get("/api/competitions", async (req, res) => {
  const instrument =
    typeof req.query.instrument === "string" ? req.query.instrument : "";
  const pagination = parsePagination(req.query, "createdAt_desc", paginationDefaultLimit);
  const cacheKey = `competitions:list:${instrument || "all"}:${pagination.cursor || "first"}:${pagination.limit}:${pagination.sort}`;
  if (prisma) {
    const db = prisma;
    const response = await cacheService.wrap(cacheKey, 300, async () => {
      const competitions = await db.competition.findMany({
        where: instrument ? { instrument } : undefined,
        orderBy: { createdAt: pagination.sort === "createdAt_asc" ? "asc" : "desc" },
        ...buildPrismaPagination(pagination),
      });
      const page = buildPageResponse(
        competitions,
        pagination.limit,
        pagination.sort,
        pagination.enabled
      );
      return { competitions: page.items, pageInfo: page.pageInfo };
    });
    return res.json(response);
  }
  const filtered = instrument
    ? inMemoryCompetitions.filter((entry) => entry.instrument === instrument)
    : inMemoryCompetitions;
  const page = slicePage(filtered as Array<{ id: string } & Record<string, unknown>>, pagination);
  return res.json({ competitions: page.items, pageInfo: page.pageInfo });
});

app.post("/api/competitions", authorize(["admin", "instructor"]), async (req, res) => {
  const parsed = competitionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid competition data" });
  }

  if (prisma) {
    const competition = await prisma.competition.create({
      data: {
        instrument: parsed.data.instrument,
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      },
    });
    await queueInvalidate("competitions:list:");
    return res.json({ competition });
  }

  const entry = {
    id: randomUUID(),
    ...parsed.data,
    createdAt: new Date().toISOString(),
  };
  inMemoryCompetitions.unshift(entry);
  return res.json({ competition: entry });
});

app.get("/api/competition-submissions", async (req, res) => {
  const instrument =
    typeof req.query.instrument === "string" ? req.query.instrument : "";
  const competitionId =
    typeof req.query.competitionId === "string" ? req.query.competitionId : "";
  const pagination = parsePagination(req.query, "createdAt_desc", paginationDefaultLimit);
  const cacheKey = `${submissionsCacheKey(instrument, competitionId)}:${pagination.cursor || "first"}:${pagination.limit}:${pagination.sort}`;

  if (prisma) {
    const db = prisma;
    const response = await cacheService.wrap(cacheKey, 120, async () => {
      const submissions = await db.competitionSubmission.findMany({
        where: {
          ...(instrument ? { instrument } : {}),
          ...(competitionId ? { competitionId } : {}),
        },
        orderBy: { createdAt: pagination.sort === "createdAt_asc" ? "asc" : "desc" },
        ...buildPrismaPagination(pagination),
      });
      const voteCountMap = await getVoteCountMap(
        db,
        submissions.map((submission) => submission.id)
      );
      const enriched = mergeCompetitionScores(submissions, voteCountMap);
      const page = buildPageResponse(enriched, pagination.limit, pagination.sort, pagination.enabled);
      return { submissions: page.items, pageInfo: page.pageInfo };
    });
    return res.json(response);
  }

  const filtered = inMemoryCompetitionSubmissions.filter((entry) => {
    const matchesInstrument = instrument ? entry.instrument === instrument : true;
    const matchesCompetition = competitionId
      ? entry.competitionId === competitionId
      : true;
    return matchesInstrument && matchesCompetition;
  });

  const enriched = filtered.map((entry) => {
    const submission = entry as Record<string, unknown> & CompetitionSubmissionRecord;
    const voteCount = inMemoryCompetitionVotes.filter(
      (vote) => vote.submissionId === submission.id
    ).length;
    const judgeScore = computeJudgeScore(submission);
    return {
      ...submission,
      voteCount,
      judgeScore,
      totalScore: judgeScore + voteCount * 2,
    };
  });
  const page = slicePage(asIdentifiedRecords(enriched as Array<Record<string, unknown>>), pagination);
  return res.json({ submissions: page.items, pageInfo: page.pageInfo });
});

app.post("/api/competition-submissions", authorize(), async (req, res) => {
  const parsed = competitionSubmissionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid submission data" });
  }

  if (honeypotTriggered(parsed.data as Record<string, unknown>)) {
    logSecurityEvent("spam_blocked", req, { context: "competition_submission" });
    return res.status(400).json({ error: "Spam detected" });
  }
  const captchaResult = await verifyCaptcha(parsed.data.captchaToken, req);
  if (!captchaResult.ok) {
    logSecurityEvent("captcha_failed", req, { context: "competition_submission" });
    return res.status(400).json({ error: "Captcha validation failed" });
  }

  if (prisma) {
    const submission = await prisma.competitionSubmission.create({
      data: {
        competitionId: parsed.data.competitionId ?? null,
        userId: req.auth?.userId ?? parsed.data.userId ?? null,
        instrument: parsed.data.instrument,
        songTitle: parsed.data.songTitle,
        description: parsed.data.description ?? null,
        videoUrl: parsed.data.videoUrl,
        pitchScore: parsed.data.pitchScore ?? null,
        rhythmScore: parsed.data.rhythmScore ?? null,
        techniqueScore: parsed.data.techniqueScore ?? null,
        expressionScore: parsed.data.expressionScore ?? null,
      },
    });
    await queueInvalidate("competitions:list:");
    await queueInvalidate("leaderboard:");
    await queueService.addJob(
      "leaderboard.recompute",
      {
        instrument: parsed.data.instrument,
        competitionId: parsed.data.competitionId ?? null,
      },
      `leaderboard:${parsed.data.instrument}:${parsed.data.competitionId ?? "all"}`
    );
    logSecurityEvent("competition_submission", req, { submissionId: submission.id });
    return res.json({ submission });
  }

  const entry = {
    id: randomUUID(),
    ...parsed.data,
    userId: req.auth?.userId ?? parsed.data.userId ?? null,
    createdAt: new Date().toISOString(),
  };
  inMemoryCompetitionSubmissions.unshift(entry);
  logSecurityEvent("competition_submission", req, { submissionId: entry.id });
  return res.json({ submission: entry });
});

app.post("/api/competition-votes", authorize(), async (req, res) => {
  const parsed = competitionVoteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid vote data" });
  }

  const submissionId = parsed.data.submissionId;
  const userId = req.auth?.userId ?? parsed.data.userId ?? null;
  if (!submissionId) {
    return res.status(400).json({ error: "Missing submissionId" });
  }

  if (prisma) {
    if (userId) {
      const existing = await prisma.competitionVote.findFirst({
        where: { submissionId, userId },
      });
      if (existing) {
        return res.json({ vote: existing });
      }
    }
    const vote = await prisma.competitionVote.create({
      data: {
        submissionId,
        userId: userId ?? null,
      },
    });
    const relatedSubmission = await prisma.competitionSubmission.findUnique({
      where: { id: submissionId },
      select: { instrument: true, competitionId: true },
    });
    await queueInvalidate("competitions:list:");
    await queueInvalidate("leaderboard:");
    await queueService.addJob(
      "leaderboard.recompute",
      {
        instrument: relatedSubmission?.instrument ?? "",
        competitionId: relatedSubmission?.competitionId ?? null,
      },
      `leaderboard:${relatedSubmission?.instrument ?? "all"}:${relatedSubmission?.competitionId ?? "all"}`
    );
    logSecurityEvent("competition_vote", req, { submissionId });
    return res.json({ vote });
  }

  const existingIndex = inMemoryCompetitionVotes.findIndex(
    (vote) => vote.submissionId === submissionId && vote.userId === userId
  );
  if (existingIndex !== -1) {
    return res.json({ vote: inMemoryCompetitionVotes[existingIndex] });
  }

  const entry = {
    id: randomUUID(),
    submissionId,
    userId,
    createdAt: new Date().toISOString(),
  };
  inMemoryCompetitionVotes.unshift(entry);
  logSecurityEvent("competition_vote", req, { submissionId });
  return res.json({ vote: entry });
});

app.get("/api/competition-leaderboard", async (req, res) => {
  const instrument =
    typeof req.query.instrument === "string" ? req.query.instrument : "";
  const competitionId =
    typeof req.query.competitionId === "string" ? req.query.competitionId : "";
  if (prisma) {
    const db = prisma;
    const leaderboard = await cacheService.wrap(
      leaderboardCacheKey(instrument, competitionId),
      300,
      async () => {
        const recomputed = await recomputeLeaderboardCache(db, {
          instrument,
          competitionId,
        });
        return recomputed.slice(0, 10);
      }
    );
    return res.json({ leaderboard });
  }

  const enriched = inMemoryCompetitionSubmissions
    .filter((entry) =>
      instrument
        ? entry.instrument === instrument &&
          (competitionId ? entry.competitionId === competitionId : true)
        : competitionId
          ? entry.competitionId === competitionId
          : true
    )
    .map((entry) => {
      const submission = entry as Record<string, unknown> & CompetitionSubmissionRecord;
      const voteCount = inMemoryCompetitionVotes.filter(
        (vote) => vote.submissionId === submission.id
      ).length;
      const judgeScore = computeJudgeScore(submission);
      return {
        ...submission,
        voteCount,
        judgeScore,
        totalScore: judgeScore + voteCount * 2,
      };
    });
  const leaderboard = enriched
    .sort((a, b) => Number(b.totalScore || 0) - Number(a.totalScore || 0))
    .slice(0, 10);
  return res.json({ leaderboard });
});

const slugifyMarketplace = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

app.get("/api/services", async (req, res) => {
  const category = typeof req.query.category === "string" ? req.query.category : "";
  const pagination = parsePagination(req.query, "createdAt_desc", paginationDefaultLimit);

  if (prisma) {
    const services = await prisma.marketplaceService.findMany({
      where: category ? { category } : undefined,
      orderBy: { createdAt: pagination.sort === "createdAt_asc" ? "asc" : "desc" },
      ...buildPrismaPagination(pagination),
    });
    const page = buildPageResponse(services, pagination.limit, pagination.sort, pagination.enabled);
    return res.json({ services: page.items, pageInfo: page.pageInfo });
  }

  const filtered = category
    ? inMemoryMarketplaceServices.filter((item) => item.category === category)
    : inMemoryMarketplaceServices;
  const page = slicePage(filtered as Array<{ id: string } & Record<string, unknown>>, pagination);
  return res.json({ services: page.items, pageInfo: page.pageInfo });
});

app.get("/api/services/:slug", async (req, res) => {
  const { slug } = req.params;
  if (prisma) {
    const service = await prisma.marketplaceService.findUnique({
      where: { slug },
    });
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    return res.json({ service });
  }

  const service = inMemoryMarketplaceServices.find((item) => item.slug === slug);
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }
  return res.json({ service });
});

app.post("/api/services", async (req, res) => {
  const parsed = marketplaceServiceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid service data" });
  }

  const slug = slugifyMarketplace(parsed.data.title);

  if (prisma) {
    const service = await prisma.marketplaceService.create({
      data: {
        slug,
        title: parsed.data.title,
        description: parsed.data.description,
        price: parsed.data.price,
        category: parsed.data.category,
        deliveryTime: parsed.data.deliveryTime,
        sellerName: parsed.data.sellerName ?? null,
        sellerBio: parsed.data.sellerBio ?? null,
        sellerImage: parsed.data.sellerImage ?? null,
        portfolio: parsed.data.portfolio
          ? (parsed.data.portfolio as Prisma.InputJsonValue)
          : undefined,
      },
    });
    await queueInvalidate("services:");
    return res.json({ service });
  }

  const entry = {
    id: randomUUID(),
    slug,
    ...parsed.data,
    createdAt: new Date().toISOString(),
  };
  inMemoryMarketplaceServices.unshift(entry);
  return res.json({ service: entry });
});

app.get("/api/orders", async (req, res) => {
  const serviceId =
    typeof req.query.serviceId === "string" ? req.query.serviceId : "";
  const userId = typeof req.query.userId === "string" ? req.query.userId : "";
  const pagination = parsePagination(req.query, "createdAt_desc", paginationDefaultLimit);

  if (prisma) {
    const orders = await prisma.marketplaceOrder.findMany({
      where: {
        ...(serviceId ? { serviceId } : {}),
        ...(userId ? { userId } : {}),
      },
      orderBy: { createdAt: pagination.sort === "createdAt_asc" ? "asc" : "desc" },
      ...buildPrismaPagination(pagination),
    });
    const page = buildPageResponse(orders, pagination.limit, pagination.sort, pagination.enabled);
    return res.json({ orders: page.items, pageInfo: page.pageInfo });
  }

  const filtered = inMemoryMarketplaceOrders.filter((item) => {
    const matchesService = serviceId ? item.serviceId === serviceId : true;
    const matchesUser = userId ? item.userId === userId : true;
    return matchesService && matchesUser;
  });
  const page = slicePage(filtered as Array<{ id: string } & Record<string, unknown>>, pagination);
  return res.json({ orders: page.items, pageInfo: page.pageInfo });
});

app.post("/api/orders", async (req, res) => {
  const parsed = marketplaceOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid order data" });
  }

  const statusValue = parsed.data.status ?? "Pending";

  if (prisma) {
    const order = await prisma.marketplaceOrder.create({
      data: {
        serviceId: parsed.data.serviceId ?? null,
        userId: req.auth?.userId ?? parsed.data.userId ?? null,
        buyerName: parsed.data.buyerName ?? null,
        buyerEmail: encryptValue(parsed.data.buyerEmail ?? null) ?? null,
        status: statusValue,
        amount: parsed.data.amount ?? 0,
      },
    });
    await queueService.addJob(
      "notification.dispatch",
      { type: "order.created", orderId: order.id, serviceId: parsed.data.serviceId ?? null },
      `order:${order.id}`
    );
    return res.json({ order });
  }

  const entry = {
    id: randomUUID(),
    ...parsed.data,
    status: statusValue,
    amount: parsed.data.amount ?? 0,
    createdAt: new Date().toISOString(),
  };
  inMemoryMarketplaceOrders.unshift(entry);
  return res.json({ order: entry });
});

app.get("/api/marketplace-reviews", async (req, res) => {
  const serviceId =
    typeof req.query.serviceId === "string" ? req.query.serviceId : "";
  const pagination = parsePagination(req.query, "createdAt_desc", paginationDefaultLimit);

  if (prisma) {
    const reviews = await prisma.marketplaceReview.findMany({
      where: serviceId ? { serviceId } : undefined,
      orderBy: { createdAt: pagination.sort === "createdAt_asc" ? "asc" : "desc" },
      ...buildPrismaPagination(pagination),
    });
    const page = buildPageResponse(reviews, pagination.limit, pagination.sort, pagination.enabled);
    return res.json({ reviews: page.items, pageInfo: page.pageInfo });
  }

  const filtered = serviceId
    ? inMemoryMarketplaceReviews.filter((item) => item.serviceId === serviceId)
    : inMemoryMarketplaceReviews;
  const page = slicePage(filtered as Array<{ id: string } & Record<string, unknown>>, pagination);
  return res.json({ reviews: page.items, pageInfo: page.pageInfo });
});

app.post("/api/marketplace-reviews", async (req, res) => {
  const parsed = marketplaceReviewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid review data" });
  }

  if (prisma) {
    const review = await prisma.marketplaceReview.create({
      data: {
        serviceId: parsed.data.serviceId ?? null,
        userId: req.auth?.userId ?? parsed.data.userId ?? null,
        buyerName: parsed.data.buyerName ?? null,
        rating: parsed.data.rating,
        reviewText: parsed.data.reviewText,
      },
    });
    return res.json({ review });
  }

  const entry = {
    id: randomUUID(),
    ...parsed.data,
    createdAt: new Date().toISOString(),
  };
  inMemoryMarketplaceReviews.unshift(entry);
  return res.json({ review: entry });
});

const calculateTalentRanking = (talent: Record<string, unknown>) => {
  const competitionScore = Number(talent.competitionScore ?? 0);
  const aiScore = Number(talent.aiScore ?? 0);
  const engagementScore = Number(talent.engagementScore ?? 0);
  const score = competitionScore * 0.5 + aiScore * 0.3 + engagementScore * 0.2;
  return Math.round(score * 10) / 10;
};

app.get("/api/talents", async (req, res) => {
  const instrument = typeof req.query.instrument === "string" ? req.query.instrument : "";
  const pagination = parsePagination(req.query, "rankingScore_desc", paginationDefaultLimit);
  if (prisma) {
    const db = prisma;
    const cacheKey = `talents:list:${instrument || "all"}:${pagination.cursor || "first"}:${pagination.limit}:${pagination.sort}`;
    const response = await cacheService.wrap(cacheKey, 300, async () => {
      const talents = await db.talent.findMany({
        where: instrument ? { instrument } : undefined,
        orderBy:
          pagination.sort === "createdAt_desc"
            ? { createdAt: "desc" }
            : pagination.sort === "createdAt_asc"
              ? { createdAt: "asc" }
              : { rankingScore: "desc" },
        ...buildPrismaPagination(pagination),
      });
      const ranked = talents.map((talent) => ({
        ...talent,
        rankingScore:
          talent.rankingScore ??
          calculateTalentRanking(talent as Record<string, unknown>),
      }));
      const page = buildPageResponse(
        ranked,
        pagination.limit,
        pagination.sort,
        pagination.enabled
      );
      return { talents: page.items, pageInfo: page.pageInfo };
    });
    return res.json(response);
  }

  const ranked = inMemoryTalents
    .filter((talent) => (instrument ? talent.instrument === instrument : true))
    .map((talent) => ({
      ...talent,
      rankingScore: calculateTalentRanking(talent),
    }));
  const page = slicePage(asIdentifiedRecords(ranked), pagination);
  return res.json({ talents: page.items, pageInfo: page.pageInfo });
});

app.get("/api/talents/:username", async (req, res) => {
  const { username } = req.params;
  if (prisma) {
    const talent = await prisma.talent.findUnique({ where: { username } });
    if (!talent) {
      return res.status(404).json({ error: "Talent not found" });
    }
    const rankedTalent = {
      ...talent,
      rankingScore:
        talent.rankingScore ??
        calculateTalentRanking(talent as Record<string, unknown>),
    };
    return res.json({ talent: rankedTalent });
  }

  const talent = inMemoryTalents.find((item) => item.username === username);
  if (!talent) {
    return res.status(404).json({ error: "Talent not found" });
  }
  return res.json({
    talent: { ...talent, rankingScore: calculateTalentRanking(talent) },
  });
});

app.post("/api/talent-requests", async (req, res) => {
  const parsed = talentRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid talent request data" });
  }

  if (honeypotTriggered(parsed.data as Record<string, unknown>)) {
    logSecurityEvent("spam_blocked", req, { context: "talent_request" });
    return res.status(400).json({ error: "Spam detected" });
  }
  const captchaResult = await verifyCaptcha(parsed.data.captchaToken, req);
  if (!captchaResult.ok) {
    logSecurityEvent("captcha_failed", req, { context: "talent_request" });
    return res.status(400).json({ error: "Captcha validation failed" });
  }

  const encryptedEmail = encryptValue(parsed.data.contactEmail) || parsed.data.contactEmail;

  if (prisma) {
    const request = await prisma.talentRequest.create({
      data: {
        ...parsed.data,
        contactEmail: encryptedEmail,
      },
    });
    return res.json({ request });
  }

  const request = {
    id: randomUUID(),
    ...parsed.data,
    contactEmail: encryptedEmail,
    createdAt: new Date().toISOString(),
  };
  inMemoryTalentRequests.unshift(request);
  logSecurityEvent("talent_request_created", req, { talentId: parsed.data.talentId });
  return res.json({ request });
});

app.get("/api/modules", async (req, res) => {
  const courseId = typeof req.query.courseId === "string" ? req.query.courseId : "";
  const pagination = parsePagination(req.query, "order_asc", paginationDefaultLimit);

  if (prisma) {
    const modules = await prisma.module.findMany({
      where: courseId ? { courseId } : undefined,
      orderBy: { order: pagination.sort === "order_desc" ? "desc" : "asc" },
      ...buildPrismaPagination(pagination),
    });
    const page = buildPageResponse(modules, pagination.limit, pagination.sort, pagination.enabled);
    return res.json({ modules: page.items, pageInfo: page.pageInfo });
  }

  const filtered = courseId
    ? inMemoryModules.filter((item) => item.courseId === courseId)
    : inMemoryModules;
  const page = slicePage(filtered as Array<{ id: string } & Record<string, unknown>>, pagination);
  return res.json({ modules: page.items, pageInfo: page.pageInfo });
});

app.post("/api/modules", authorize(["admin", "instructor"]), async (req, res) => {
  const parsed = moduleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid module data" });
  }

  if (prisma) {
    const moduleRecord = await prisma.module.create({ data: parsed.data });
    await queueInvalidate("courses:list:");
    return res.json({ module: moduleRecord });
  }

  const moduleRecord = {
    id: randomUUID(),
    ...parsed.data,
    createdAt: new Date().toISOString(),
  };
  inMemoryModules.unshift(moduleRecord);
  return res.json({ module: moduleRecord });
});

app.put("/api/modules/:id", authorize(["admin", "instructor"]), async (req, res) => {
  const parsed = moduleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid module data" });
  }

  const { id } = req.params;
  if (prisma) {
    const moduleRecord = await prisma.module.update({
      where: { id },
      data: parsed.data,
    });
    await queueInvalidate("courses:list:");
    return res.json({ module: moduleRecord });
  }

  const index = inMemoryModules.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Module not found" });
  }
  inMemoryModules[index] = { ...inMemoryModules[index], ...parsed.data };
  return res.json({ module: inMemoryModules[index] });
});

app.delete("/api/modules/:id", authorize(["admin", "instructor"]), async (req, res) => {
  const { id } = req.params;
  if (prisma) {
    await prisma.module.delete({ where: { id } });
    await queueInvalidate("courses:list:");
    return res.json({ ok: true });
  }

  const index = inMemoryModules.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Module not found" });
  }
  inMemoryModules.splice(index, 1);
  return res.json({ ok: true });
});

app.get("/api/lessons", async (req, res) => {
  const moduleId = typeof req.query.moduleId === "string" ? req.query.moduleId : "";
  const pagination = parsePagination(req.query, "order_asc", paginationDefaultLimit);

  if (prisma) {
    const lessons = await prisma.lesson.findMany({
      where: moduleId ? { moduleId } : undefined,
      orderBy: { order: pagination.sort === "order_desc" ? "desc" : "asc" },
      ...buildPrismaPagination(pagination),
    });
    const page = buildPageResponse(lessons, pagination.limit, pagination.sort, pagination.enabled);
    return res.json({ lessons: page.items, pageInfo: page.pageInfo });
  }

  const filtered = moduleId
    ? inMemoryLessons.filter((item) => item.moduleId === moduleId)
    : inMemoryLessons;
  const page = slicePage(filtered as Array<{ id: string } & Record<string, unknown>>, pagination);
  return res.json({ lessons: page.items, pageInfo: page.pageInfo });
});

app.post("/api/lessons", authorize(["admin", "instructor"]), async (req, res) => {
  const parsed = lessonSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid lesson data" });
  }

  if (prisma) {
    const lessonRecord = await prisma.lesson.create({
      data: {
        title: parsed.data.title,
        videoUrl: parsed.data.videoUrl ?? null,
        notes: parsed.data.notes ?? null,
        duration: parsed.data.duration ?? "45 min",
        theory: parsed.data.theory ?? null,
        pdfUrl: parsed.data.pdfUrl ?? null,
        module: parsed.data.title,
        week: 1,
        order: 1,
        ...(parsed.data.moduleId
          ? {
              moduleRef: {
                connect: { id: parsed.data.moduleId },
              },
            }
          : {}),
      },
    });
    await queueInvalidate("courses:list:");
    return res.json({ lesson: lessonRecord });
  }

  const lessonRecord = {
    id: randomUUID(),
    ...parsed.data,
    module: parsed.data.title,
    week: 1,
    order: 1,
    createdAt: new Date().toISOString(),
  };
  inMemoryLessons.unshift(lessonRecord);
  return res.json({ lesson: lessonRecord });
});

app.put("/api/lessons/:id", authorize(["admin", "instructor"]), async (req, res) => {
  const parsed = lessonSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid lesson data" });
  }

  const { id } = req.params;
  if (prisma) {
    const lessonRecord = await prisma.lesson.update({
      where: { id },
      data: parsed.data,
    });
    await queueInvalidate("courses:list:");
    return res.json({ lesson: lessonRecord });
  }

  const index = inMemoryLessons.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Lesson not found" });
  }
  inMemoryLessons[index] = { ...inMemoryLessons[index], ...parsed.data };
  return res.json({ lesson: inMemoryLessons[index] });
});

app.delete("/api/lessons/:id", authorize(["admin", "instructor"]), async (req, res) => {
  const { id } = req.params;
  if (prisma) {
    await prisma.lesson.delete({ where: { id } });
    await queueInvalidate("courses:list:");
    return res.json({ ok: true });
  }

  const index = inMemoryLessons.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Lesson not found" });
  }
  inMemoryLessons.splice(index, 1);
  return res.json({ ok: true });
});

app.get("/api/assignments", async (req, res) => {
  const lessonId = typeof req.query.lessonId === "string" ? req.query.lessonId : "";
  const pagination = parsePagination(req.query, "createdAt_desc", paginationDefaultLimit);

  if (prisma) {
    const assignments = await prisma.assignment.findMany({
      where: lessonId ? { lessonId } : undefined,
      orderBy: { createdAt: pagination.sort === "createdAt_asc" ? "asc" : "desc" },
      ...buildPrismaPagination(pagination),
    });
    const page = buildPageResponse(
      assignments,
      pagination.limit,
      pagination.sort,
      pagination.enabled
    );
    return res.json({ assignments: page.items, pageInfo: page.pageInfo });
  }

  const filtered = lessonId
    ? inMemoryAssignments.filter((item) => item.lessonId === lessonId)
    : inMemoryAssignments;
  const page = slicePage(filtered as Array<{ id: string } & Record<string, unknown>>, pagination);
  return res.json({ assignments: page.items, pageInfo: page.pageInfo });
});

app.post("/api/assignments", authorize(["admin", "instructor"]), async (req, res) => {
  const parsed = assignmentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid assignment data" });
  }

  if (prisma) {
    const assignment = await prisma.assignment.create({ data: parsed.data });
    await queueInvalidate("courses:list:");
    return res.json({ assignment });
  }

  const assignment = {
    id: randomUUID(),
    ...parsed.data,
    createdAt: new Date().toISOString(),
  };
  inMemoryAssignments.unshift(assignment);
  return res.json({ assignment });
});

app.put("/api/assignments/:id", authorize(["admin", "instructor"]), async (req, res) => {
  const parsed = assignmentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid assignment data" });
  }

  const { id } = req.params;
  if (prisma) {
    const assignment = await prisma.assignment.update({
      where: { id },
      data: parsed.data,
    });
    await queueInvalidate("courses:list:");
    return res.json({ assignment });
  }

  const index = inMemoryAssignments.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Assignment not found" });
  }
  inMemoryAssignments[index] = { ...inMemoryAssignments[index], ...parsed.data };
  return res.json({ assignment: inMemoryAssignments[index] });
});

app.delete("/api/assignments/:id", authorize(["admin", "instructor"]), async (req, res) => {
  const { id } = req.params;
  if (prisma) {
    await prisma.assignment.delete({ where: { id } });
    await queueInvalidate("courses:list:");
    return res.json({ ok: true });
  }

  const index = inMemoryAssignments.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Assignment not found" });
  }
  inMemoryAssignments.splice(index, 1);
  return res.json({ ok: true });
});

app.get("/api/practice-exercises", async (req, res) => {
  const lessonId = typeof req.query.lessonId === "string" ? req.query.lessonId : "";
  const pagination = parsePagination(req.query, "createdAt_desc", paginationDefaultLimit);

  if (prisma) {
    const exercises = await prisma.practiceExercise.findMany({
      where: lessonId ? { lessonId } : undefined,
      orderBy: { createdAt: pagination.sort === "createdAt_asc" ? "asc" : "desc" },
      ...buildPrismaPagination(pagination),
    });
    const page = buildPageResponse(exercises, pagination.limit, pagination.sort, pagination.enabled);
    return res.json({ exercises: page.items, pageInfo: page.pageInfo });
  }

  const filtered = lessonId
    ? inMemoryPracticeExercises.filter((item) => item.lessonId === lessonId)
    : inMemoryPracticeExercises;
  const page = slicePage(filtered as Array<{ id: string } & Record<string, unknown>>, pagination);
  return res.json({ exercises: page.items, pageInfo: page.pageInfo });
});

app.post(
  "/api/practice-exercises",
  authorize(["admin", "instructor"]),
  async (req, res) => {
  const parsed = practiceExerciseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid practice exercise data" });
  }

  if (prisma) {
    const exercise = await prisma.practiceExercise.create({ data: parsed.data });
    await queueInvalidate("courses:list:");
    return res.json({ exercise });
  }

  const exercise = {
    id: randomUUID(),
    ...parsed.data,
    createdAt: new Date().toISOString(),
  };
  inMemoryPracticeExercises.unshift(exercise);
  return res.json({ exercise });
});

app.put(
  "/api/practice-exercises/:id",
  authorize(["admin", "instructor"]),
  async (req, res) => {
  const parsed = practiceExerciseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid practice exercise data" });
  }

  const { id } = req.params;
  if (prisma) {
    const exercise = await prisma.practiceExercise.update({
      where: { id },
      data: parsed.data,
    });
    await queueInvalidate("courses:list:");
    return res.json({ exercise });
  }

  const index = inMemoryPracticeExercises.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Exercise not found" });
  }
  inMemoryPracticeExercises[index] = {
    ...inMemoryPracticeExercises[index],
    ...parsed.data,
  };
  return res.json({ exercise: inMemoryPracticeExercises[index] });
});

app.delete(
  "/api/practice-exercises/:id",
  authorize(["admin", "instructor"]),
  async (req, res) => {
  const { id } = req.params;
  if (prisma) {
    await prisma.practiceExercise.delete({ where: { id } });
    await queueInvalidate("courses:list:");
    return res.json({ ok: true });
  }

  const index = inMemoryPracticeExercises.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Exercise not found" });
  }
  inMemoryPracticeExercises.splice(index, 1);
  return res.json({ ok: true });
});

app.get("/api/admin/users", authorize(["admin"]), async (req, res) => {
  if (!req.auth || req.auth.role !== "admin") {
    return res.status(403).json({ error: "Insufficient permissions" });
  }
  if (!isSupabaseAdminConfigured()) {
    return res.status(503).json({ error: "Supabase admin is not configured" });
  }
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return res.status(503).json({ error: "Supabase admin is not configured" });
  }

  const page = Math.max(Number(req.query.page ?? 1) || 1, 1);
  const perPage = Math.min(Math.max(Number(req.query.perPage ?? 50) || 50, 1), 200);

  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page,
    perPage,
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const users = (data?.users ?? []).map((user) => {
    const userMetadata = (user.user_metadata ?? {}) as Record<string, unknown>;
    const appMetadata = (user.app_metadata ?? {}) as Record<string, unknown>;
    const approvedFlag = userMetadata.approved;
    const approved = approvedFlag === true || approvedFlag === "true";
    return {
      id: user.id,
      email: user.email ?? null,
      role: String(appMetadata.role ?? "student"),
      approved,
      createdAt: user.created_at ?? null,
      lastSignInAt: user.last_sign_in_at ?? null,
    };
  });

  return res.json({ users, page, perPage, total: data?.total ?? null });
});

app.post("/api/admin/users/:id/approval", authorize(["admin"]), async (req, res) => {
  if (!req.auth || req.auth.role !== "admin") {
    return res.status(403).json({ error: "Insufficient permissions" });
  }
  if (!isSupabaseAdminConfigured()) {
    return res.status(503).json({ error: "Supabase admin is not configured" });
  }
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return res.status(503).json({ error: "Supabase admin is not configured" });
  }

  const parsed = approvalSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid approval payload" });
  }

  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const { data: existing, error: readError } =
    await supabaseAdmin.auth.admin.getUserById(userId);
  if (readError || !existing?.user) {
    return res.status(404).json({ error: readError?.message ?? "User not found" });
  }

  const userMetadata = (existing.user.user_metadata ?? {}) as Record<string, unknown>;
  const nextMetadata = { ...userMetadata, approved: parsed.data.approved };

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: nextMetadata,
  });

  if (error || !data?.user) {
    return res.status(500).json({ error: error?.message ?? "Unable to update user" });
  }

  const approvedFlag = (data.user.user_metadata as Record<string, unknown> | undefined)
    ?.approved;
  const approved = approvedFlag === true || approvedFlag === "true";

  return res.json({
    user: {
      id: data.user.id,
      email: data.user.email ?? null,
      approved,
    },
  });
});

app.get("/api/admin/bootstrap", authorize(["admin", "instructor"]), async (req, res) => {
  const pagination = parsePagination(req.query, "createdAt_desc", 100);

  if (prisma) {
    const [posts, reviews, tools, instruments, courses, modules, lessons, assignments, exercises] =
      await Promise.all([
        prisma.blogPost.findMany({
          orderBy: { createdAt: "desc" },
          ...buildPrismaPagination(pagination),
        }),
        prisma.review.findMany({
          orderBy: { createdAt: "desc" },
          ...buildPrismaPagination(pagination),
        }),
        prisma.tool.findMany({
          orderBy: { createdAt: "desc" },
          ...buildPrismaPagination(pagination),
        }),
        prisma.instrument.findMany({
          orderBy: { createdAt: "desc" },
          ...buildPrismaPagination(pagination),
        }),
        prisma.course.findMany({
          orderBy: { createdAt: "desc" },
          ...buildPrismaPagination(pagination),
        }),
        prisma.module.findMany({
          orderBy: { order: "asc" },
          ...buildPrismaPagination({
            ...pagination,
            sort: "order_asc",
          }),
        }),
        prisma.lesson.findMany({
          orderBy: { order: "asc" },
          ...buildPrismaPagination({
            ...pagination,
            sort: "order_asc",
          }),
        }),
        prisma.assignment.findMany({
          orderBy: { createdAt: "desc" },
          ...buildPrismaPagination(pagination),
        }),
        prisma.practiceExercise.findMany({
          orderBy: { createdAt: "desc" },
          ...buildPrismaPagination(pagination),
        }),
      ]);

    const payload = {
      blog: {
        posts: buildPageResponse(posts, pagination.limit, pagination.sort, true),
      },
      reviews: {
        reviews: buildPageResponse(reviews, pagination.limit, pagination.sort, true),
      },
      tools: {
        tools: buildPageResponse(tools, pagination.limit, pagination.sort, true),
      },
      instruments: {
        instruments: buildPageResponse(instruments, pagination.limit, pagination.sort, true),
      },
      courses: {
        courses: buildPageResponse(courses, pagination.limit, pagination.sort, true),
      },
      modules: {
        modules: buildPageResponse(modules, pagination.limit, "order_asc", true),
      },
      lessons: {
        lessons: buildPageResponse(lessons, pagination.limit, "order_asc", true),
      },
      assignments: {
        assignments: buildPageResponse(assignments, pagination.limit, pagination.sort, true),
      },
      exercises: {
        exercises: buildPageResponse(exercises, pagination.limit, pagination.sort, true),
      },
    };

    return res.json({
      blog: { posts: payload.blog.posts.items, pageInfo: payload.blog.posts.pageInfo },
      reviews: {
        reviews: payload.reviews.reviews.items,
        pageInfo: payload.reviews.reviews.pageInfo,
      },
      tools: { tools: payload.tools.tools.items, pageInfo: payload.tools.tools.pageInfo },
      instruments: {
        instruments: payload.instruments.instruments.items,
        pageInfo: payload.instruments.instruments.pageInfo,
      },
      courses: {
        courses: payload.courses.courses.items,
        pageInfo: payload.courses.courses.pageInfo,
      },
      modules: {
        modules: payload.modules.modules.items,
        pageInfo: payload.modules.modules.pageInfo,
      },
      lessons: {
        lessons: payload.lessons.lessons.items,
        pageInfo: payload.lessons.lessons.pageInfo,
      },
      assignments: {
        assignments: payload.assignments.assignments.items,
        pageInfo: payload.assignments.assignments.pageInfo,
      },
      exercises: {
        exercises: payload.exercises.exercises.items,
        pageInfo: payload.exercises.exercises.pageInfo,
      },
    });
  }

  return res.json({
    blog: {
      posts: inMemoryBlogs.slice(0, pagination.limit),
      pageInfo: buildPageInfo(asIdentifiedRecords(inMemoryBlogs), pagination.limit, pagination.sort),
    },
    reviews: {
      reviews: inMemoryReviews.slice(0, pagination.limit),
      pageInfo: buildPageInfo(asIdentifiedRecords(inMemoryReviews), pagination.limit, pagination.sort),
    },
    tools: {
      tools: inMemoryTools.slice(0, pagination.limit),
      pageInfo: buildPageInfo(asIdentifiedRecords(inMemoryTools), pagination.limit, pagination.sort),
    },
    instruments: {
      instruments: inMemoryInstruments.slice(0, pagination.limit),
      pageInfo: buildPageInfo(
        asIdentifiedRecords(inMemoryInstruments),
        pagination.limit,
        pagination.sort
      ),
    },
    courses: {
      courses: inMemoryCourses.slice(0, pagination.limit),
      pageInfo: buildPageInfo(asIdentifiedRecords(inMemoryCourses), pagination.limit, pagination.sort),
    },
    modules: {
      modules: inMemoryModules.slice(0, pagination.limit),
      pageInfo: buildPageInfo(asIdentifiedRecords(inMemoryModules), pagination.limit, "order_asc"),
    },
    lessons: {
      lessons: inMemoryLessons.slice(0, pagination.limit),
      pageInfo: buildPageInfo(asIdentifiedRecords(inMemoryLessons), pagination.limit, "order_asc"),
    },
    assignments: {
      assignments: inMemoryAssignments.slice(0, pagination.limit),
      pageInfo: buildPageInfo(asIdentifiedRecords(inMemoryAssignments), pagination.limit, pagination.sort),
    },
    exercises: {
      exercises: inMemoryPracticeExercises.slice(0, pagination.limit),
      pageInfo: buildPageInfo(
        asIdentifiedRecords(inMemoryPracticeExercises),
        pagination.limit,
        pagination.sort
      ),
    },
  });
});

app.listen(PORT, () => {
  console.log(`Melody Monks backend running on port ${PORT}`);
});

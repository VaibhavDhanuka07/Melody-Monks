import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";

export type UploadKind =
  | "lesson-video"
  | "performance-upload"
  | "competition-upload"
  | "profile-image"
  | "resource"
  | "course-image"
  | "instrument-image"
  | "blog-image";

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const supabaseAdmin =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

const kindToBucket: Record<UploadKind, string> = {
  "lesson-video": "lesson-videos",
  "performance-upload": "performance-uploads",
  "competition-upload": "performance-uploads",
  "profile-image": "profile-images",
  resource: "resources",
  "course-image": "course-images",
  "instrument-image": "instrument-images",
  "blog-image": "blog-images",
};

const isPublicBucket = (bucket: string) =>
  [
    "performance-uploads",
    "profile-images",
    "resources",
    "course-images",
    "instrument-images",
    "blog-images",
  ].includes(bucket);

const sanitizeSegment = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const extensionForType = (contentType: string, fallbackName: string) => {
  const fallback = fallbackName.includes(".")
    ? fallbackName.split(".").pop() ?? "bin"
    : "bin";
  const mapped: Record<string, string> = {
    "video/mp4": "mp4",
    "video/quicktime": "mov",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "application/pdf": "pdf",
    "audio/mpeg": "mp3",
  };
  return mapped[contentType] ?? fallback;
};

const buildPath = (kind: UploadKind, fileName: string, userId?: string | null) => {
  const safeName = sanitizeSegment(fileName.replace(/\.[^.]+$/, "")) || "asset";
  const extension = extensionForType("application/octet-stream", fileName);
  const owner = sanitizeSegment(userId || "guest");
  const date = new Date().toISOString().slice(0, 10);
  return `${kind}/${owner}/${date}/${safeName}-${randomUUID()}.${extension}`;
};

export const storageService = {
  isConfigured() {
    return Boolean(supabaseAdmin);
  },
  async isReady() {
    return Boolean(supabaseAdmin);
  },
  async createSignedUpload(params: {
    kind: UploadKind;
    fileName: string;
    contentType: string;
    userId?: string | null;
  }) {
    if (!supabaseAdmin) {
      throw new Error("Supabase storage is not configured");
    }

    const bucket = kindToBucket[params.kind];
    const extension = extensionForType(params.contentType, params.fileName);
    const path = buildPath(
      params.kind,
      `${params.fileName.replace(/\.[^.]+$/, "")}.${extension}`,
      params.userId
    );
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (error || !data) {
      throw new Error(error?.message || "Unable to create signed upload URL");
    }

    const publicUrl = isPublicBucket(bucket)
      ? supabaseAdmin.storage.from(bucket).getPublicUrl(path).data.publicUrl
      : null;

    return {
      bucket,
      path,
      token: data.token,
      signedUrl: data.signedUrl,
      publicUrl,
    };
  },
  async createSignedReadUrl(bucket: string, path: string, expiresIn = 3600) {
    if (!supabaseAdmin) {
      throw new Error("Supabase storage is not configured");
    }
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);
    if (error || !data) {
      throw new Error(error?.message || "Unable to create signed read URL");
    }
    return data.signedUrl;
  },
  toPublicUrl(bucket: string, path: string) {
    if (!supabaseAdmin) return null;
    return supabaseAdmin.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  },
  async uploadBuffer(params: {
    bucket: string;
    path: string;
    contentType: string;
    data: Buffer;
    upsert?: boolean;
  }) {
    if (!supabaseAdmin) {
      throw new Error("Supabase storage is not configured");
    }
    const { error } = await supabaseAdmin.storage.from(params.bucket).upload(params.path, params.data, {
      contentType: params.contentType,
      upsert: params.upsert ?? true,
    });
    if (error) {
      throw new Error(error.message);
    }
    return supabaseAdmin.storage.from(params.bucket).getPublicUrl(params.path).data.publicUrl;
  },
};

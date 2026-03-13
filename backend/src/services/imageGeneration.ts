import type { PrismaClient } from "@prisma/client";
import { aiImageService } from "./aiImages.js";
import { storageService } from "./storage.js";
import { cacheService } from "./cache.js";

export type ImageEntity = "course" | "blog" | "instrument";

type ImageInput = {
  entity: ImageEntity;
  id: string;
  title?: string;
  instrument?: string;
  category?: string;
  slug?: string;
};

const styleSuffix =
  process.env.AI_IMAGE_STYLE ??
  "dark cinematic background, premium music academy aesthetic, studio lighting, high detail, no text, no watermark";

const sanitizeSegment = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "image";

const extensionForType = (contentType: string) => {
  if (contentType.includes("png")) return "png";
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return "jpg";
  if (contentType.includes("webp")) return "webp";
  return "png";
};

const buildPrompt = (input: ImageInput) => {
  const base =
    input.entity === "course"
      ? `cinematic course cover for ${input.instrument ?? "music"} students, course title ${
          input.title ?? "music mastery"
        }`
      : input.entity === "blog"
        ? `editorial photograph illustrating ${input.title ?? "music learning"} in the context of ${
            input.category ?? "music"
          }`
        : `studio photograph of ${input.title ?? input.instrument ?? "musical instrument"}`;

  return `${base}, ${styleSuffix}`;
};

const bucketByEntity: Record<ImageEntity, string> = {
  course: "course-images",
  blog: "blog-images",
  instrument: "instrument-images",
};

const cachePrefixByEntity: Record<ImageEntity, string> = {
  course: "courses:list:",
  blog: "blog:",
  instrument: "instruments:list:",
};

export const generateAndStoreImage = async (
  prisma: PrismaClient,
  input: ImageInput
) => {
  if (!aiImageService.isConfigured()) {
    throw new Error("AI image generation not configured");
  }
  if (!storageService.isConfigured()) {
    throw new Error("Supabase storage not configured");
  }

  const prompt = buildPrompt(input);
  const image = await aiImageService.generate(prompt);
  const bucket = bucketByEntity[input.entity];
  const safeKey = sanitizeSegment(input.slug || input.title || input.instrument || input.id);
  const extension = extensionForType(image.contentType);
  const path = `ai/${input.entity}/${safeKey}-${input.id}.${extension}`;
  const publicUrl = await storageService.uploadBuffer({
    bucket,
    path,
    contentType: image.contentType,
    data: image.buffer,
    upsert: true,
  });

  switch (input.entity) {
    case "course":
      await prisma.course.update({
        where: { id: input.id },
        data: { thumbnailUrl: publicUrl },
      });
      break;
    case "blog":
      await prisma.blogPost.update({
        where: { id: input.id },
        data: { imageUrl: publicUrl, image: publicUrl },
      });
      break;
    case "instrument":
      await prisma.instrument.update({
        where: { id: input.id },
        data: { imageUrl: publicUrl },
      });
      break;
    default:
      break;
  }

  const prefix = cachePrefixByEntity[input.entity];
  await cacheService.deleteByPrefix(prefix);
  return publicUrl;
};

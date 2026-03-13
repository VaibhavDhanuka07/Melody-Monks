import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL ?? "";
export const allowInMemoryFallbacks =
  process.env.ALLOW_IN_MEMORY_FALLBACKS === "true" || process.env.NODE_ENV !== "production";

export const prisma = databaseUrl ? new PrismaClient() : null;

export const isDatabaseConfigured = () => Boolean(prisma);

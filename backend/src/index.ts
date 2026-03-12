import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
      : "*",
  })
);
app.use(express.json({ limit: "1mb" }));

const databaseUrl = process.env.DATABASE_URL;
const prisma = databaseUrl ? new PrismaClient() : null;

const inMemoryLeads: Array<Record<string, unknown>> = [];
const inMemoryPerformances: Array<Record<string, unknown>> = [];

const bookingSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  instrument: z.string().optional(),
  mode: z.string().optional(),
  preferredTime: z.string().optional(),
});

const performanceSchema = z.object({
  name: z.string().min(2),
  title: z.string().min(2),
  videoUrl: z.string().url(),
  notes: z.string().optional(),
});

const whatsappNumber = process.env.WHATSAPP_NUMBER || "91XXXXXXXXXX";
const whatsappMessage =
  process.env.WHATSAPP_MESSAGE ||
  "Hi, I want to book a free piano trial class.";
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  whatsappMessage
)}`;

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/bookings", async (req, res) => {
  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid booking data" });
  }

  const { name, phone, instrument, mode, preferredTime } = parsed.data;

  if (prisma) {
    await prisma.trialLead.create({
      data: {
        name,
        phone,
        instrument: instrument || "Piano",
        mode: mode || "Online",
        preferredTime: preferredTime || null,
      },
    });
  } else {
    inMemoryLeads.push({ name, phone, instrument, mode, preferredTime });
  }

  return res.json({ ok: true, whatsappLink });
});

app.get("/api/performance-submissions", async (_req, res) => {
  if (prisma) {
    const submissions = await prisma.performanceSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json({ submissions });
  }

  return res.json({ submissions: inMemoryPerformances });
});

app.post("/api/performance-submissions", async (req, res) => {
  const parsed = performanceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid performance data" });
  }

  const { name, title, videoUrl, notes } = parsed.data;

  if (prisma) {
    await prisma.performanceSubmission.create({
      data: { name, title, videoUrl, notes: notes || null },
    });
  } else {
    inMemoryPerformances.push({ name, title, videoUrl, notes });
  }

  return res.json({ ok: true });
});

app.post("/api/payments/checkout", async (_req, res) => {
  return res.json({
    checkoutUrl: "https://checkout.stripe.com/pay/placeholder",
  });
});

app.listen(PORT, () => {
  console.log(`Melody Monks backend running on port ${PORT}`);
});

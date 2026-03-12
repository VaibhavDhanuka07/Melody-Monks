import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { instagramItems } from "./data/instagram.js";

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

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      })
    : null;

const bookingSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email().optional().or(z.literal("")),
  instrument: z.string().optional(),
  mode: z.string().optional(),
  preferredTime: z.string().optional(),
});

const whatsappNumber = process.env.WHATSAPP_NUMBER || "91XXXXXXXXXX";
const whatsappMessage =
  process.env.WHATSAPP_MESSAGE ||
  "Hi, I want to book a free guitar trial class.";
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  whatsappMessage
)}`;

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/instagram", (_req, res) => {
  res.json({ items: instagramItems });
});

app.post("/api/bookings", async (req, res) => {
  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid booking data" });
  }

  const { name, phone, email, instrument, mode, preferredTime } = parsed.data;

  if (supabase) {
    const { error } = await supabase.from("trial_bookings").insert({
      name,
      phone,
      email: email || null,
      instrument: instrument || "Guitar",
      mode: mode || "Online",
      preferred_time: preferredTime || null,
      status: "new",
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.json({ ok: true, whatsappLink });
});

app.listen(PORT, () => {
  console.log(`Melody Monks backend running on port ${PORT}`);
});

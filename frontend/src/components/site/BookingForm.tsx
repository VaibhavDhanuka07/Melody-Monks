"use client";

import { useState } from "react";
import { apiBaseUrl, site } from "@/data/site";

const defaultForm = {
  name: "",
  phone: "",
  email: "",
  instrument: "Guitar",
  mode: "Online",
  preferredTime: "",
};

export default function BookingForm() {
  const [form, setForm] = useState(defaultForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || "Booking failed");
      }

      setStatus("success");
      setMessage("Thanks! Our team will contact you shortly.");
      setForm(defaultForm);
      window.open(site.whatsappLink, "_blank");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-strong space-y-6 p-8">
      <div>
        <p className="text-sm font-semibold text-brand-gold">Book a free trial</p>
        <h3 className="mt-2 text-2xl font-semibold text-ink">
          Reserve your guitar session
        </h3>
        <p className="mt-2 text-sm text-ink-muted">
          Tell us your preferred time and we will confirm the slot on WhatsApp.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-ink-muted">
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand-gold"
          />
        </label>
        <label className="text-sm text-ink-muted">
          Phone
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand-gold"
          />
        </label>
        <label className="text-sm text-ink-muted">
          Email
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand-gold"
          />
        </label>
        <label className="text-sm text-ink-muted">
          Instrument
          <input
            name="instrument"
            value={form.instrument}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand-gold"
          />
        </label>
        <label className="text-sm text-ink-muted">
          Online or Offline
          <select
            name="mode"
            value={form.mode}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand-gold"
          >
            <option>Online</option>
            <option>Offline</option>
          </select>
        </label>
        <label className="text-sm text-ink-muted">
          Preferred time
          <input
            name="preferredTime"
            value={form.preferredTime}
            onChange={handleChange}
            placeholder="Evening, weekend, etc."
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand-gold"
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="btn-primary"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Submitting..." : "Book Your Free Trial"}
        </button>
        <p className="text-xs text-ink-muted">
          Slots are limited each week. We respond within 24 hours.
        </p>
      </div>

      {message ? (
        <p
          className={`text-sm ${
            status === "error" ? "text-red-300" : "text-emerald-300"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}

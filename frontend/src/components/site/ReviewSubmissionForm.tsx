"use client";

import { useState } from "react";
import { apiBaseUrl, coursePaths } from "@/data/site";

const defaultForm = {
  studentName: "",
  program: coursePaths[0]?.title ?? "Hindustani Classical Vocal",
  rating: "5",
  reviewText: "",
};

export default function ReviewSubmissionForm() {
  const [form, setForm] = useState(defaultForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/reviews/public`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: form.studentName,
          program: form.program,
          rating: Number(form.rating),
          reviewText: form.reviewText,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || "Review submission failed");
      }

      setStatus("success");
      setMessage("Thanks for sharing your experience. We appreciate it!");
      setForm(defaultForm);
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
        <p className="text-sm font-semibold text-brand-gold">Share your review</p>
        <h3 className="mt-2 text-2xl font-semibold text-ink">
          Tell us about your Melody Monks experience
        </h3>
        <p className="mt-2 text-sm text-ink-muted">
          Your feedback helps new students choose the right learning path.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-ink-muted">
          Name
          <input
            name="studentName"
            value={form.studentName}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand-gold"
          />
        </label>
        <label className="text-sm text-ink-muted">
          Course
          <select
            name="program"
            value={form.program}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand-gold"
          >
            {coursePaths.map((course) => (
              <option key={course.title} value={course.title}>
                {course.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-ink-muted">
          Rating
          <select
            name="rating"
            value={form.rating}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand-gold"
          >
            <option value="5">5 - Excellent</option>
            <option value="4.5">4.5 - Great</option>
            <option value="4">4 - Very Good</option>
            <option value="3.5">3.5 - Good</option>
            <option value="3">3 - Okay</option>
          </select>
        </label>
        <label className="text-sm text-ink-muted md:col-span-2">
          Review
          <textarea
            name="reviewText"
            value={form.reviewText}
            onChange={handleChange}
            required
            rows={4}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand-gold"
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={status === "loading"}>
          {status === "loading" ? "Submitting..." : "Submit Review"}
        </button>
        <p className="text-xs text-ink-muted">
          We review submissions to keep the community helpful and authentic.
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

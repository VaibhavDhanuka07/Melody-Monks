"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { uploadFileWithSignedUrl } from "@/lib/storage/upload";

export default function PerformanceUploadPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const uploaded = await uploadFileWithSignedUrl({
        file,
        kind: "performance-upload",
      });
      setUploadedUrl(uploaded.url);
      return uploaded.url;
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to upload video"
      );
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const file = formData.get("videoFile") as File;
    let videoUrl = String(formData.get("videoUrl") || "");

    if (file && file.size > 0) {
      const uploaded = await handleUpload(file);
      if (uploaded) {
        videoUrl = uploaded;
      }
    }

    if (!videoUrl) {
      setStatus("error");
      setMessage("Please provide a video link or upload a file.");
      return;
    }

    const payload = {
      name: formData.get("name"),
      title: formData.get("title"),
      videoUrl,
      notes: formData.get("notes"),
    };

    try {
      const response = await apiFetch("/api/performance-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        auth: true,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Unable to submit performance");
      }

      setStatus("success");
      setMessage("Performance submitted for instructor review.");
      setUploadedUrl(null);
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Try again."
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-gold">Performance Upload</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">
          Submit your performance
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Upload a video or paste a link for instructor feedback.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-ink-muted">
            Name
            <input
              name="name"
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            />
          </label>
          <label className="text-sm text-ink-muted">
            Performance title
            <input
              name="title"
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            />
          </label>
          <label className="text-sm text-ink-muted md:col-span-2">
            Upload video file (optional)
            <input
              type="file"
              name="videoFile"
              accept="video/*"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            />
          </label>
          <label className="text-sm text-ink-muted md:col-span-2">
            Video link (Supabase, Vimeo, or Drive)
            <input
              name="videoUrl"
              placeholder="https://..."
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            />
          </label>
          <label className="text-sm text-ink-muted md:col-span-2">
            Notes for the instructor
            <input
              name="notes"
              placeholder="What would you like feedback on?"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            />
          </label>
        </div>
        <button type="submit" className="btn-primary" disabled={status === "loading"}>
          {status === "loading" ? "Submitting..." : "Submit Performance"}
        </button>
        {uploading ? (
          <p className="text-xs text-ink-muted">Uploading video...</p>
        ) : null}
        {uploadedUrl ? (
          <p className="text-xs text-emerald-300">Upload complete.</p>
        ) : null}
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

      <div className="card p-6 text-sm text-ink-muted">
        Tip: configure Supabase storage to enable direct video uploads from this
        dashboard.
      </div>
    </div>
  );
}

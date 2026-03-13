import { apiFetch } from "@/lib/api/client";
import { supabase } from "@/lib/supabase/client";

export type UploadKind =
  | "lesson-video"
  | "performance-upload"
  | "competition-upload"
  | "profile-image"
  | "resource";

type SignedUploadResponse = {
  bucket: string;
  path: string;
  token: string;
  signedUrl: string;
  publicUrl: string | null;
};

export const uploadFileWithSignedUrl = async (params: {
  file: File;
  kind: UploadKind;
}) => {
  if (!supabase) {
    throw new Error(
      "Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable uploads."
    );
  }

  const response = await apiFetch("/api/uploads/signed-url", {
    method: "POST",
    auth: true,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      kind: params.kind,
      fileName: params.file.name,
      contentType: params.file.type,
      fileSize: params.file.size,
    }),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(data?.error || "Unable to create upload authorization.");
  }

  const upload = (await response.json()) as SignedUploadResponse;
  const { error } = await supabase.storage
    .from(upload.bucket)
    .uploadToSignedUrl(upload.path, upload.token, params.file, {
      contentType: params.file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  if (!upload.publicUrl) {
    throw new Error("Upload complete, but no public URL is available for this file.");
  }

  return {
    url: upload.publicUrl,
    bucket: upload.bucket,
    path: upload.path,
  };
};

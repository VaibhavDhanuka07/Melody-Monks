import { createClient } from "@supabase/supabase-js";
import { fetchLatestInstagramPosts, type InstagramPostRecord } from "./fetchLatestInstagramPosts.js";

type SyncResult = {
  fetched: number;
  upserted: number;
  upsertMode: "with_metrics" | "without_metrics";
};

const isUndefinedColumnError = (message: string) =>
  message.toLowerCase().includes("column") &&
  (message.includes("like_count") || message.includes("comments_count"));

const stripMetrics = (posts: InstagramPostRecord[]) =>
  posts.map(({ like_count, comments_count, ...rest }) => rest);

export const syncInstagramPostsToSupabase = async (options?: {
  limit?: number;
}): Promise<SyncResult> => {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const posts = await fetchLatestInstagramPosts({ limit: options?.limit ?? 9 });
  if (posts.length === 0) {
    return { fetched: 0, upserted: 0, upsertMode: "with_metrics" };
  }

  const attempt = await supabase
    .from("instagram_posts")
    .upsert(posts, { onConflict: "id" });

  if (!attempt.error) {
    return { fetched: posts.length, upserted: posts.length, upsertMode: "with_metrics" };
  }

  const message = attempt.error.message ?? "";
  if (!isUndefinedColumnError(message)) {
    throw new Error(message);
  }

  const fallback = await supabase
    .from("instagram_posts")
    .upsert(stripMetrics(posts), { onConflict: "id" });

  if (fallback.error) {
    throw new Error(fallback.error.message);
  }

  return { fetched: posts.length, upserted: posts.length, upsertMode: "without_metrics" };
};


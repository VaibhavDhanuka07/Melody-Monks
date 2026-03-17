/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { instagramPosts, instagramProfileUrl } from "@/data/instagram";

type InstagramPostRow = {
  id: string;
  media_url: string;
  media_type: string;
  caption: string | null;
  permalink: string;
  timestamp: string;
  like_count?: number | null;
  comments_count?: number | null;
};

const toInstagramEmbedUrl = (url: string) => {
  try {
    const normalized =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`;
    const parsed = new URL(normalized);
    if (!parsed.hostname.endsWith("instagram.com")) return null;

    const [kind, id] = parsed.pathname.split("/").filter(Boolean);
    if (!kind || !id) return null;
    if (!["p", "reel", "tv"].includes(kind)) return null;

    return `https://www.instagram.com/${kind}/${id}/embed/`;
  } catch {
    return null;
  }
};

const formatCompactCount = (value: number) => {
  if (!Number.isFinite(value)) return "-";
  if (value < 1000) return String(value);
  if (value < 1_000_000) return `${(value / 1000).toFixed(value >= 10_000 ? 0 : 1)}k`;
  return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}m`;
};

const inferTitle = (post: InstagramPostRow) => {
  const caption = post.caption?.trim();
  if (caption) {
    return caption.length > 64 ? `${caption.slice(0, 61)}...` : caption;
  }
  return "Instagram post";
};

const isReelLike = (mediaType: string) => {
  const value = mediaType.toUpperCase();
  return value.includes("REEL") || value === "VIDEO";
};

const PlayIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="none"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M10.25 8.75v6.5L16 12l-5.75-3.25z"
      fill="currentColor"
    />
  </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
    <path
      d="M12 20s-7-4.3-9.3-8.2C.6 8.6 2.6 5.5 6 5.5c1.7 0 3.2.9 4 2.1.8-1.2 2.3-2.1 4-2.1 3.4 0 5.4 3.1 3.3 6.3C19 15.7 12 20 12 20z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const CommentIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
    <path
      d="M7.5 19.5 4 20l.5-3.5A8.5 8.5 0 1 1 7.5 19.5z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPostRow[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasSupabase = Boolean(supabase);
  type CuratedEmbedPost = (typeof instagramPosts)[number] & { embedUrl: string };
  const curatedFallback = useMemo(
    (): CuratedEmbedPost[] =>
      instagramPosts
        .map((post) => {
          const embedUrl = post.embedUrl ?? toInstagramEmbedUrl(post.url);
          if (!embedUrl) return null;
          return { ...post, embedUrl };
        })
        .filter((post): post is CuratedEmbedPost => Boolean(post)),
    []
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!supabase) {
        setStatus("error");
        setErrorMessage(
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
        );
        return;
      }

      setStatus("loading");
      setErrorMessage(null);

      const withMetricsSelect =
        "id, media_url, media_type, caption, permalink, timestamp, like_count, comments_count";
      const baseSelect = "id, media_url, media_type, caption, permalink, timestamp";

      const primary = await supabase
        .from("instagram_posts")
        .select(withMetricsSelect)
        .order("timestamp", { ascending: false })
        .limit(9);

      const shouldFallback =
        Boolean(primary.error) &&
        (primary.error?.message ?? "").toLowerCase().includes("column") &&
        ((primary.error?.message ?? "").includes("like_count") ||
          (primary.error?.message ?? "").includes("comments_count"));

      const result = shouldFallback
        ? await supabase
            .from("instagram_posts")
            .select(baseSelect)
            .order("timestamp", { ascending: false })
            .limit(9)
        : primary;

      if (cancelled) return;

      if (result.error) {
        setStatus("error");
        setErrorMessage(result.error.message);
        setPosts([]);
        return;
      }

      const rows = (result.data ?? []) as unknown as InstagramPostRow[];
      setPosts(rows);
      setStatus("ready");
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const placeholders = useMemo(() => Array.from({ length: 9 }, (_, idx) => idx), []);

  const showCuratedFallback =
    curatedFallback.length > 0 &&
    (status === "error" || (status === "ready" && posts.length === 0));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-gold">Instagram Feed</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">
            {showCuratedFallback
              ? "Featured reels from @musicianvasu"
              : "Latest posts from @musicianvasu"}
          </h3>
          <p className="mt-2 text-sm text-ink-muted">
            {showCuratedFallback
              ? "Curated reels embedded directly from Instagram."
              : "Synced every 6 hours and rendered in a live grid."}
          </p>
        </div>
        <a
          href={instagramProfileUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary"
        >
          Open Instagram
        </a>
      </div>

      {!showCuratedFallback && !hasSupabase ? (
        <div className="card-strong p-6 text-sm text-ink-muted">
          Supabase is not configured for the frontend.
        </div>
      ) : null}

      {!showCuratedFallback && status === "error" ? (
        <div className="card-strong p-6 text-sm text-ink-muted">
          Unable to load Instagram posts{errorMessage ? `: ${errorMessage}` : "."}
        </div>
      ) : null}

      {!showCuratedFallback && status === "ready" && posts.length === 0 ? (
        <div className="card-strong p-6 text-sm text-ink-muted">
          No Instagram posts yet. Run the backend sync job to populate{" "}
          <span className="font-semibold text-ink">instagram_posts</span>.
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {showCuratedFallback
          ? curatedFallback.map((post) => (
              <div
                key={post.id}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-black/50 shadow-soft"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <iframe
                    title={post.title}
                    src={post.embedUrl}
                    className="h-full w-full border-0"
                    loading="lazy"
                    allowFullScreen
                    allow="clipboard-write; encrypted-media; picture-in-picture; web-share"
                  />
                  <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] font-semibold text-ink backdrop-blur">
                    {post.type}
                  </span>
                </div>

                <div className="space-y-1 px-4 py-4">
                  <p className="text-sm font-semibold text-ink">{post.title}</p>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-brand-gold hover:text-brand-gold-soft"
                  >
                    View on Instagram
                  </a>
                </div>
              </div>
            ))
          : (status === "loading" ? placeholders : posts).map((item) => {
          const post =
            typeof item === "number"
              ? null
              : (item as unknown as InstagramPostRow);

          const title = post ? inferTitle(post) : "Loading post";
          const href = post?.permalink ?? instagramProfileUrl;
          const mediaType = post?.media_type ?? "POST";
          const showPlay = post ? isReelLike(mediaType) : false;
          const likes =
            typeof post?.like_count === "number" ? formatCompactCount(post.like_count) : "-";
          const comments =
            typeof post?.comments_count === "number"
              ? formatCompactCount(post.comments_count)
              : "-";

          return (
            <a
              key={post?.id ?? `placeholder-${item}`}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={post ? `Open Instagram post: ${title}` : "Loading Instagram post"}
              className={[
                "group relative overflow-hidden rounded-3xl border border-white/10 bg-black/50 shadow-soft",
                "transition duration-300 hover:-translate-y-0.5 hover:border-brand-gold/40 hover:shadow-glow",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70 focus-visible:ring-offset-0",
              ].join(" ")}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                {post ? (
                  <img
                    src={post.media_url}
                    alt={title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full animate-pulse bg-white/5" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90 transition group-hover:opacity-100" />

                {showPlay ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full border border-brand-gold/40 bg-black/50 p-3 text-brand-gold shadow-soft backdrop-blur transition group-hover:scale-105 group-hover:shadow-glow">
                      <PlayIcon className="h-7 w-7" />
                    </div>
                  </div>
                ) : null}

                <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] font-semibold text-ink backdrop-blur">
                  {post ? mediaType : "Loading"}
                </div>

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-4 py-4 opacity-0 transition group-hover:opacity-100">
                  <div className="flex items-center gap-4 text-xs font-semibold text-ink">
                    <span className="inline-flex items-center gap-1.5">
                      <HeartIcon className="h-4 w-4 text-brand-gold-soft" />
                      {likes}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CommentIcon className="h-4 w-4 text-brand-gold-soft" />
                      {comments}
                    </span>
                  </div>
                  <span className="rounded-full border border-brand-gold/40 bg-black/60 px-3 py-1 text-[11px] font-semibold text-brand-gold backdrop-blur">
                    View
                  </span>
                </div>
              </div>

              <div className="space-y-1 px-4 py-4">
                <p className="text-sm font-semibold text-ink">{title}</p>
                {post?.timestamp ? (
                  <p className="text-xs text-ink-muted">
                    {new Date(post.timestamp).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </p>
                ) : (
                  <p className="text-xs text-ink-muted">Loading timestamp...</p>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

type InstagramApiMediaItem = {
  id?: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  media_product_type?: string;
  like_count?: number;
  comments_count?: number;
};

type InstagramApiResponse = {
  data?: InstagramApiMediaItem[];
};

export type InstagramPostRecord = {
  id: string;
  media_url: string;
  media_type: string;
  caption: string | null;
  permalink: string;
  timestamp: string;
  like_count?: number | null;
  comments_count?: number | null;
};

const DEFAULT_FIELDS = [
  "id",
  "caption",
  "media_type",
  "media_url",
  "thumbnail_url",
  "permalink",
  "timestamp",
  "media_product_type",
  "like_count",
  "comments_count",
].join(",");

const BASIC_DISPLAY_FIELDS = [
  "id",
  "caption",
  "media_type",
  "media_url",
  "thumbnail_url",
  "permalink",
  "timestamp",
].join(",");

const normalizeMediaType = (item: InstagramApiMediaItem) => {
  const mediaProductType = item.media_product_type?.toUpperCase() ?? "";
  const mediaType = item.media_type?.toUpperCase() ?? "";

  if (mediaProductType === "REELS" || mediaProductType === "REEL") {
    return "REEL";
  }

  if (mediaType === "CAROUSEL_ALBUM") {
    return "CAROUSEL";
  }

  if (mediaType) {
    return mediaType;
  }

  return mediaProductType || "UNKNOWN";
};

const selectDisplayMediaUrl = (item: InstagramApiMediaItem) => {
  const mediaType = item.media_type?.toUpperCase() ?? "";
  if (mediaType === "VIDEO" && item.thumbnail_url) {
    return item.thumbnail_url;
  }
  return item.media_url ?? "";
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export const fetchLatestInstagramPosts = async (options?: {
  limit?: number;
  fields?: string;
}) => {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN ?? "";
  const igUserId = process.env.INSTAGRAM_IG_USER_ID ?? "";
  const apiVersion = process.env.INSTAGRAM_GRAPH_API_VERSION ?? "v19.0";
  const limit = options?.limit ?? 9;
  const useFacebookGraph = Boolean(igUserId);
  const fields =
    options?.fields ?? (useFacebookGraph ? DEFAULT_FIELDS : BASIC_DISPLAY_FIELDS);

  if (!accessToken) {
    throw new Error("INSTAGRAM_ACCESS_TOKEN is required to fetch Instagram media.");
  }

  const endpoint = useFacebookGraph
    ? `https://graph.facebook.com/${apiVersion}/${igUserId}/media`
    : "https://graph.instagram.com/me/media";

  const url = new URL(endpoint);
  url.searchParams.set("fields", fields);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url.toString(), {
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Instagram Graph API request failed (${response.status}): ${text || response.statusText}`
    );
  }

  const payload = (await response.json()) as InstagramApiResponse;
  const items = Array.isArray(payload.data) ? payload.data : [];

  const posts: InstagramPostRecord[] = [];
  for (const item of items) {
    if (!isNonEmptyString(item.id)) continue;

    const mediaUrl = selectDisplayMediaUrl(item).trim();
    if (!mediaUrl) continue;

    const permalink = isNonEmptyString(item.permalink) ? item.permalink.trim() : "";
    const timestamp = isNonEmptyString(item.timestamp) ? item.timestamp.trim() : "";
    if (!permalink || !timestamp) continue;

    posts.push({
      id: item.id,
      media_url: mediaUrl,
      media_type: normalizeMediaType(item),
      caption: isNonEmptyString(item.caption) ? item.caption.trim() : null,
      permalink,
      timestamp,
      like_count: typeof item.like_count === "number" ? item.like_count : null,
      comments_count:
        typeof item.comments_count === "number" ? item.comments_count : null,
    });
  }

  return posts;
};

import { apiBaseUrl } from "@/data/site";
import { supabase } from "@/lib/supabase/client";

export type PageInfo = {
  hasNextPage: boolean;
  nextCursor: string | null;
  limit: number;
  sort: string;
};

type QueryValue = string | number | boolean | null | undefined;

type ApiFetchOptions = RequestInit & {
  auth?: boolean;
  includeAdminKey?: boolean;
  query?: Record<string, QueryValue>;
};

const adminApiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY ?? "";

const normalizePath = (path: string) =>
  path.startsWith("/") ? path : `/${path}`;

export const buildApiUrl = (
  path: string,
  query?: Record<string, QueryValue>
) => {
  const url = new URL(`${apiBaseUrl}${normalizePath(path)}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        return;
      }
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
};

export const getAuthHeaders = async (includeAdminKey = true) => {
  const headers = new Headers();

  if (includeAdminKey && adminApiKey) {
    headers.set("x-admin-key", adminApiKey);
  }

  if (supabase) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers.set("Authorization", `Bearer ${session.access_token}`);
    }
  }

  return headers;
};

export const apiFetch = async (
  path: string,
  options: ApiFetchOptions = {}
) => {
  const {
    auth = false,
    includeAdminKey = true,
    query,
    headers,
    ...init
  } = options;

  const mergedHeaders = new Headers(headers ?? {});
  if (auth) {
    const authHeaders = await getAuthHeaders(includeAdminKey);
    authHeaders.forEach((value, key) => mergedHeaders.set(key, value));
  }

  return fetch(buildApiUrl(path, query), {
    ...init,
    headers: mergedHeaders,
  });
};

type PaginationInput = {
  limit?: string | string[];
  cursor?: string | string[];
  sort?: string | string[];
};

export type PaginationOptions = {
  enabled: boolean;
  limit: number;
  cursor: string | null;
  sort: string;
};

export type PageInfo = {
  hasNextPage: boolean;
  nextCursor: string | null;
  limit: number;
  sort: string;
};

const MAX_LIMIT = 100;

export const encodeCursor = (value: string) =>
  Buffer.from(value, "utf8").toString("base64url");

export const decodeCursor = (value?: string | null) => {
  if (!value) return null;
  try {
    return Buffer.from(value, "base64url").toString("utf8");
  } catch {
    return value;
  }
};

const readValue = (value?: string | string[]) => {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
};

export const parsePagination = (
  query: PaginationInput,
  defaultSort: string,
  defaultLimit = 50
): PaginationOptions => {
  const rawLimit = readValue(query.limit);
  const rawCursor = readValue(query.cursor);
  const rawSort = readValue(query.sort);
  const parsedLimit = Number(rawLimit);
  const limit = Number.isFinite(parsedLimit)
    ? Math.min(MAX_LIMIT, Math.max(1, parsedLimit))
    : defaultLimit;

  return {
    enabled: Boolean(rawLimit || rawCursor || rawSort),
    limit,
    cursor: decodeCursor(rawCursor ?? null),
    sort: rawSort ?? defaultSort,
  };
};

export const buildPageInfo = <T extends { id: string }>(
  records: T[],
  limit: number,
  sort: string
): PageInfo => {
  const hasNextPage = records.length > limit;
  const slice = hasNextPage ? records.slice(0, limit) : records;
  const nextCursor = hasNextPage ? encodeCursor(slice[slice.length - 1].id) : null;
  return {
    hasNextPage,
    nextCursor,
    limit,
    sort,
  };
};

export const slicePage = <T extends { id: string }>(
  records: T[],
  options: PaginationOptions
) => {
  if (!options.enabled) {
    return {
      items: records,
      pageInfo: {
        hasNextPage: false,
        nextCursor: null,
        limit: records.length,
        sort: options.sort,
      } satisfies PageInfo,
    };
  }

  const startIndex = options.cursor
    ? records.findIndex((record) => record.id === options.cursor) + 1
    : 0;
  const paged = records.slice(startIndex, startIndex + options.limit + 1);
  const pageInfo = buildPageInfo(paged, options.limit, options.sort);
  return {
    items: pageInfo.hasNextPage ? paged.slice(0, options.limit) : paged,
    pageInfo,
  };
};

export const buildPrismaPagination = (options: PaginationOptions) => {
  if (!options.enabled) {
    return {};
  }

  return {
    take: options.limit + 1,
    ...(options.cursor
      ? {
          cursor: { id: options.cursor },
          skip: 1,
        }
      : {}),
  };
};

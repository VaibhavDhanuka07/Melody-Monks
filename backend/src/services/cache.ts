import IORedis, { type Redis as RedisClient } from "ioredis";

type CacheEntry = {
  expiresAt: number;
  payload: string;
};

const redisUrl = process.env.REDIS_URL ?? "";
const allowMemoryFallback =
  process.env.ALLOW_IN_MEMORY_FALLBACKS === "true" || process.env.NODE_ENV !== "production";

const memoryStore = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<unknown>>();

let redis: RedisClient | null = null;
if (redisUrl) {
  const RedisConstructor = IORedis as unknown as new (
    url: string,
    options?: Record<string, unknown>
  ) => RedisClient;
  const client = new RedisConstructor(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
  });
  client.on("error", () => {
    // Keep cache optional and fail-soft for reads.
  });
  redis = client;
}

const readMemory = (key: string) => {
  const entry = memoryStore.get(key);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    memoryStore.delete(key);
    return null;
  }
  return entry.payload;
};

const writeMemory = (key: string, payload: string, ttlSeconds: number) => {
  memoryStore.set(key, {
    payload,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
};

const deleteMemoryPrefix = (prefix: string) => {
  for (const key of memoryStore.keys()) {
    if (key.startsWith(prefix)) {
      memoryStore.delete(key);
    }
  }
};

export const cacheService = {
  isConfigured() {
    return Boolean(redis || allowMemoryFallback);
  },
  async isReady() {
    if (redis) {
      try {
        if (redis.status !== "ready") {
          await redis.connect();
        }
        await redis.ping();
        return true;
      } catch {
        return false;
      }
    }
    return allowMemoryFallback;
  },
  async get<T>(key: string): Promise<T | null> {
    try {
      if (redis) {
        if (redis.status !== "ready") {
          await redis.connect();
        }
        const payload = await redis.get(key);
        return payload ? (JSON.parse(payload) as T) : null;
      }
      if (!allowMemoryFallback) {
        return null;
      }
      const payload = readMemory(key);
      return payload ? (JSON.parse(payload) as T) : null;
    } catch {
      return null;
    }
  },
  async set<T>(key: string, value: T, ttlSeconds: number) {
    const payload = JSON.stringify(value);
    if (redis) {
      try {
        if (redis.status !== "ready") {
          await redis.connect();
        }
        await redis.set(key, payload, "EX", ttlSeconds);
        return;
      } catch {
        // fall through
      }
    }
    if (allowMemoryFallback) {
      writeMemory(key, payload, ttlSeconds);
    }
  },
  async delete(key: string) {
    if (redis) {
      try {
        if (redis.status !== "ready") {
          await redis.connect();
        }
        await redis.del(key);
      } catch {
        // ignore
      }
    }
    memoryStore.delete(key);
  },
  async deleteByPrefix(prefix: string) {
    if (redis) {
      try {
        if (redis.status !== "ready") {
          await redis.connect();
        }
        let cursor = "0";
        do {
          const [nextCursor, keys] = await redis.scan(cursor, "MATCH", `${prefix}*`, "COUNT", 50);
          cursor = nextCursor;
          if (keys.length > 0) {
            await redis.del(...keys);
          }
        } while (cursor !== "0");
      } catch {
        // ignore
      }
    }
    deleteMemoryPrefix(prefix);
  },
  async wrap<T>(key: string, ttlSeconds: number, loader: () => Promise<T>) {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const existing = inflight.get(key) as Promise<T> | undefined;
    if (existing) {
      return existing;
    }

    const promise = loader()
      .then(async (value) => {
        await this.set(key, value, ttlSeconds);
        inflight.delete(key);
        return value;
      })
      .catch((error) => {
        inflight.delete(key);
        throw error;
      });

    inflight.set(key, promise);
    return promise;
  },
};

import { Queue, QueueEvents, Worker } from "bullmq";
import IORedis, { type Redis as RedisClient } from "ioredis";

export const queueName = "melody-monks";

export type QueueJobName =
  | "leaderboard.recompute"
  | "notification.dispatch"
  | "certificate.generate"
  | "upload.process"
  | "cache.invalidate"
  | "image.generate";

const redisUrl = process.env.REDIS_URL ?? "";

let connection: RedisClient | null = null;
let queue: Queue | null = null;
let events: QueueEvents | null = null;

if (redisUrl) {
  const RedisConstructor = IORedis as unknown as new (
    url: string,
    options?: Record<string, unknown>
  ) => RedisClient;
  const client = new RedisConstructor(redisUrl, {
    maxRetriesPerRequest: null,
    lazyConnect: true,
  });
  connection = client;
  queue = new Queue(queueName, {
    connection: client as any,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: 100,
      removeOnFail: 200,
    },
  });
  events = new QueueEvents(queueName, { connection: client as any });
  events.on("error", () => {
    // Queue metrics remain optional.
  });
}

export const queueService = {
  isConfigured() {
    return Boolean(queue);
  },
  async isReady() {
    if (!connection) {
      return false;
    }
    try {
      if (connection.status !== "ready") {
        await connection.connect();
      }
      await connection.ping();
      return true;
    } catch {
      return false;
    }
  },
  async addJob(name: QueueJobName, data: Record<string, unknown>, jobId?: string) {
    if (!queue) {
      return null;
    }
    if (connection && connection.status !== "ready") {
      await connection.connect();
    }
    return queue.add(name, data, {
      jobId,
    });
  },
  createWorker(
    processor: (name: QueueJobName, data: Record<string, unknown>) => Promise<void>
  ) {
    if (!connection) {
      return null;
    }
    return new Worker(
      queueName,
      async (job) => {
        await processor(job.name as QueueJobName, (job.data ?? {}) as Record<string, unknown>);
      },
      {
        connection: connection as any,
        concurrency: 5,
      }
    );
  },
};

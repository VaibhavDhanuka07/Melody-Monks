import dotenv from "dotenv";
import { queueService, type QueueJobName } from "./services/queue.js";
import { prisma } from "./services/prisma.js";
import { recomputeLeaderboardCache } from "./services/competition.js";
import { cacheService } from "./services/cache.js";
import { realtimeService } from "./services/realtime.js";
import { generateAndStoreImage, type ImageEntity } from "./services/imageGeneration.js";
import { recordQueueMetric } from "./lib/metrics.js";

dotenv.config();

const processJob = async (name: QueueJobName, data: Record<string, unknown>) => {
  switch (name) {
    case "leaderboard.recompute": {
      if (!prisma) {
        return;
      }
      const instrument =
        typeof data.instrument === "string" ? data.instrument : undefined;
      const competitionId =
        typeof data.competitionId === "string" ? data.competitionId : undefined;
      const leaderboard = await recomputeLeaderboardCache(prisma, {
        instrument,
        competitionId,
      });
      if (instrument) {
        await realtimeService.publish(`competition:${instrument}`, "leaderboard-updated", {
          instrument,
          count: leaderboard.length,
        });
      }
      return;
    }
    case "cache.invalidate": {
      const prefix = typeof data.prefix === "string" ? data.prefix : "";
      if (prefix) {
        await cacheService.deleteByPrefix(prefix);
      }
      return;
    }
    case "notification.dispatch": {
      console.info(
        JSON.stringify({
          event: "notification_dispatch",
          at: new Date().toISOString(),
          payload: data,
        })
      );
      return;
    }
    case "certificate.generate": {
      console.info(
        JSON.stringify({
          event: "certificate_generate",
          at: new Date().toISOString(),
          payload: data,
        })
      );
      return;
    }
    case "upload.process": {
      console.info(
        JSON.stringify({
          event: "upload_process",
          at: new Date().toISOString(),
          payload: data,
        })
      );
      return;
    }
    case "image.generate": {
      if (!prisma) {
        return;
      }
      const entity = typeof data.entity === "string" ? (data.entity as ImageEntity) : null;
      const id = typeof data.id === "string" ? data.id : null;
      if (!entity || !id) {
        throw new Error("Invalid image generation payload");
      }
      await generateAndStoreImage(prisma, {
        entity,
        id,
        title: typeof data.title === "string" ? data.title : undefined,
        instrument: typeof data.instrument === "string" ? data.instrument : undefined,
        category: typeof data.category === "string" ? data.category : undefined,
        slug: typeof data.slug === "string" ? data.slug : undefined,
      });
      return;
    }
    default:
      return;
  }
};

const worker = queueService.createWorker(async (name, data) => {
  recordQueueMetric(name, "scheduled");
  try {
    await processJob(name, data);
    recordQueueMetric(name, "completed");
  } catch (error) {
    recordQueueMetric(name, "failed");
    throw error;
  }
});

if (!worker) {
  console.log("Worker disabled: configure REDIS_URL to enable background jobs.");
} else {
  worker.on("failed", (job, error) => {
    console.error(
      JSON.stringify({
        event: "worker_failed",
        at: new Date().toISOString(),
        jobName: job?.name,
        jobId: job?.id,
        error: error.message,
      })
    );
  });
  console.log("Melody Monks worker running.");
}

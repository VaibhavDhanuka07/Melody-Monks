import type { Request, Response, NextFunction } from "express";
import client from "prom-client";

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpDuration = new client.Histogram({
  name: "melody_monks_http_request_duration_ms",
  help: "HTTP request duration in milliseconds",
  labelNames: ["method", "route", "status_code"] as const,
  buckets: [25, 50, 100, 250, 500, 1000, 2500, 5000],
  registers: [register],
});

const httpRequests = new client.Counter({
  name: "melody_monks_http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status_code"] as const,
  registers: [register],
});

const queueJobs = new client.Counter({
  name: "melody_monks_queue_jobs_total",
  help: "Queued jobs by name and status",
  labelNames: ["job_name", "status"] as const,
  registers: [register],
});

const cacheEvents = new client.Counter({
  name: "melody_monks_cache_events_total",
  help: "Cache hit and miss counts",
  labelNames: ["result"] as const,
  registers: [register],
});

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startedAt = process.hrtime.bigint();
  res.on("finish", () => {
    const elapsed = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    const route = req.route?.path ? `${req.baseUrl}${req.route.path}` : req.path;
    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode),
    };
    httpDuration.observe(labels, elapsed);
    httpRequests.inc(labels);
  });
  next();
};

export const recordQueueMetric = (jobName: string, status: "scheduled" | "completed" | "failed") => {
  queueJobs.inc({ job_name: jobName, status });
};

export const recordCacheMetric = (result: "hit" | "miss") => {
  cacheEvents.inc({ result });
};

export const metricsHandler = async (_req: Request, res: Response) => {
  res.setHeader("Content-Type", register.contentType);
  res.end(await register.metrics());
};

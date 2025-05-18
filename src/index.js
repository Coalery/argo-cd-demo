import express from "express";
import promClient from "prom-client";

const app = express();
const PORT = process.env.PORT || 3000;

const register = new promClient.Registry();

promClient.collectDefaultMetrics({ register });

const httpRequestCounter = new promClient.Counter({
  name: "http_requests_total",
  help: "총 요청 수",
  labelNames: ["method", "path", "status"],
  registers: [register],
});

const httpRequestDuration = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "요청 처리 시간",
  labelNames: ["method", "path", "status"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  registers: [register],
});

app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const path =
      req.path === "/metrics"
        ? "/metrics"
        : req.route
        ? req.route.path
        : req.path || req.url || "unknown";
    const method = req.method;
    const status = res.statusCode;

    httpRequestCounter.inc({ method, path, status });
    httpRequestDuration.observe({ method, path, status }, duration / 1000);
  });

  next();
});

app.get("/", (req, res) => {
  res.send("pong!");
});

app.get("/random", (req, res) => {
  const delay = Math.floor(Math.random() * 3000);

  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  }).then(() => {
    res.send("pong!");
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

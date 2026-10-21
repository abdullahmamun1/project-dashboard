import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import config from "./config/index.js";
import { globalErrorHandler, notFound } from "./middleware/globalErrorHandler.js";
import { globalLimiter } from "./middleware/rateLimiter.js";
import routes from "./routes/index.js";

const app = express();

// Behind Vercel's proxy (and the Next.js rewrite) the client IP comes from X-Forwarded-For.
app.set("trust proxy", 1);

app.use(helmet());
app.use(cors({ origin: config.clientUrls, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({ success: true, message: "Project Dashboard API" });
});

app.get("/api/v1/health", (_req, res) => {
  res.json({ success: true, message: "OK", data: { uptime: process.uptime() } });
});

app.use("/api/v1", globalLimiter, routes);

app.use(notFound);
app.use(globalErrorHandler);

// Vercel's Express runtime uses this default export as the request handler.
export default app;

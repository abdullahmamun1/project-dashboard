import rateLimit from "express-rate-limit";

const message = (text: string) => ({ success: false, message: text });

// In-memory limiters: good enough as a first line of defence. On serverless each instance keeps
// its own counters, so the per-student submission quota is additionally enforced against the DB.
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: message("Too many requests, please try again later"),
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: message("Too many authentication attempts, please try again in 15 minutes"),
});

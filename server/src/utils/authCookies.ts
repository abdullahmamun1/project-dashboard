import type { CookieOptions, Response } from "express";
import config from "../config/index.js";
import { getTokenTtlMs } from "./jwt.js";

export const AUTH_COOKIE = "token";

// The client proxies /api/* through its own origin, so the cookie is first-party and
// SameSite=Lax is enough; it is never readable from JavaScript.
const baseOptions: CookieOptions = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: "lax",
  path: "/",
};

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie(AUTH_COOKIE, token, { ...baseOptions, maxAge: getTokenTtlMs(token) });
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie(AUTH_COOKIE, baseOptions);
};

import type { Request, RequestHandler } from "express";
import type { Role } from "../generated/prisma/enums.js";
import type { SafeUser } from "../modules/user/user.interface.js";
import { UserService } from "../modules/user/user.service.js";
import AppError from "../utils/AppError.js";
import { AUTH_COOKIE } from "../utils/authCookies.js";
import { verifyToken } from "../utils/jwt.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: SafeUser;
    }
  }
}

// The httpOnly cookie is what the web client uses; the Bearer header keeps the API usable from
// tools like Postman.
const extractToken = (req: Request): string | undefined => {
  const cookieToken: unknown = req.cookies?.[AUTH_COOKIE];
  if (typeof cookieToken === "string" && cookieToken) return cookieToken;

  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7).trim() || undefined;

  return undefined;
};

/**
 * Requires a valid JWT. With roles given, also requires the user to have one of them.
 * The user is re-loaded from the database so deleted users or changed roles take effect
 * immediately instead of waiting for the token to expire.
 */
export const auth =
  (...roles: Role[]): RequestHandler =>
  async (req, _res, next) => {
    const token = extractToken(req);
    if (!token) throw new AppError(401, "You are not logged in");

    let userId: string;
    try {
      ({ userId } = verifyToken(token));
    } catch {
      throw new AppError(401, "Your session is invalid or has expired, please log in again");
    }

    const user = await UserService.findById(userId);
    if (!user) throw new AppError(401, "The user for this session no longer exists");

    if (roles.length && !roles.includes(user.role)) {
      throw new AppError(403, "You do not have permission to perform this action");
    }

    req.user = user;
    next();
  };

export default auth;

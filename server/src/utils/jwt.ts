import jwt, { type SignOptions } from "jsonwebtoken";
import config from "../config/index.js";
import type { Role } from "../generated/prisma/enums.js";

export interface JwtPayload {
  userId: string;
  role: Role;
}

export const signToken = (payload: JwtPayload) =>
  jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as SignOptions["expiresIn"],
  });

// Throws JsonWebTokenError / TokenExpiredError on an invalid token.
export const verifyToken = (token: string) => jwt.verify(token, config.jwt.secret) as JwtPayload & jwt.JwtPayload;

// Milliseconds until the token expires, used to align the cookie lifetime with the JWT.
export const getTokenTtlMs = (token: string) => {
  const { exp } = jwt.decode(token) as jwt.JwtPayload;
  return exp ? exp * 1000 - Date.now() : undefined;
};

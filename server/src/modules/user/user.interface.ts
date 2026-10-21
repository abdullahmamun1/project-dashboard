import type { Role } from "../../generated/prisma/enums.js";

// The user shape that is safe to send to clients (never includes passwordHash).
export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}

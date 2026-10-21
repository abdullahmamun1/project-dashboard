import prisma from "../../lib/prisma.js";
import type { SafeUser } from "./user.interface.js";

export const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

const findById = (id: string): Promise<SafeUser | null> =>
  prisma.user.findUnique({ where: { id }, select: safeUserSelect });

// Includes passwordHash, so only for credential checks inside the auth module.
const findByEmailWithPassword = (email: string) => prisma.user.findUnique({ where: { email } });

export const UserService = {
  findById,
  findByEmailWithPassword,
};

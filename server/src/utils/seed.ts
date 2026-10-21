import bcrypt from "bcryptjs";
import config from "../config/index.js";
import { Role } from "../generated/prisma/enums.js";
import prisma from "../lib/prisma.js";
import { SALT_ROUNDS } from "../modules/auth/auth.service.js";

/**
 * Idempotent: creates the mentor account from MENTOR_* env vars if it doesn't exist.
 * An existing account keeps its password; only its role is enforced, so the seed can never
 * quietly reset a password that was changed later.
 */
export const seedMentor = async () => {
  const { name, email, password } = config.mentor;
  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true, role: true } });

  if (!existing) {
    await prisma.user.create({
      data: { name, email, passwordHash: await bcrypt.hash(password, SALT_ROUNDS), role: Role.MENTOR },
    });
    console.log(`Seeded mentor account: ${email}`);
    return;
  }

  if (existing.role !== Role.MENTOR) {
    await prisma.user.update({ where: { id: existing.id }, data: { role: Role.MENTOR } });
    console.log(`Promoted existing account to mentor: ${email}`);
  }
};

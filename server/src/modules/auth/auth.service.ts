import bcrypt from "bcryptjs";
import { Role } from "../../generated/prisma/enums.js";
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import { signToken } from "../../utils/jwt.js";
import { safeUserSelect, UserService } from "../user/user.service.js";
import type { AuthResult, LoginInput, RegisterInput } from "./auth.interface.js";

export const SALT_ROUNDS = 12;

// Compared against when the email doesn't exist, so a login attempt takes the same time either
// way and response timing doesn't reveal which emails are registered.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", SALT_ROUNDS);

// Signup only ever creates students; mentors are seeded.
const register = async ({ name, email, password }: RegisterInput): Promise<AuthResult> => {
  const existing = await UserService.findByEmailWithPassword(email);
  if (existing) {
    throw new AppError(409, "An account with this email already exists", {
      email: ["An account with this email already exists"],
    });
  }

  const user = await prisma.user.create({
    data: { name, email, passwordHash: await bcrypt.hash(password, SALT_ROUNDS), role: Role.STUDENT },
    select: safeUserSelect,
  });

  return { user, accessToken: signToken({ userId: user.id, role: user.role }) };
};

const login = async ({ email, password }: LoginInput): Promise<AuthResult> => {
  const user = await UserService.findByEmailWithPassword(email);
  const passwordMatches = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);

  if (!user || !passwordMatches) throw new AppError(401, "Invalid email or password");

  const { passwordHash: _passwordHash, updatedAt: _updatedAt, ...safeUser } = user;
  return { user: safeUser, accessToken: signToken({ userId: user.id, role: user.role }) };
};

export const AuthService = { register, login };

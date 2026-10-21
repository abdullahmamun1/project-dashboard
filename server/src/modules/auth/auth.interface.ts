import type { z } from "zod";
import type { SafeUser } from "../user/user.interface.js";
import type { AuthValidation } from "./auth.validation.js";

export type RegisterInput = z.infer<typeof AuthValidation.register>;
export type LoginInput = z.infer<typeof AuthValidation.login>;

export interface AuthResult {
  user: SafeUser;
  accessToken: string;
}

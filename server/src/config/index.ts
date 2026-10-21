import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  // Comma-separated list of allowed origins for CORS.
  CLIENT_URL: z.string().default("http://localhost:3000"),
  MENTOR_NAME: z.string().default("Mentor"),
  MENTOR_EMAIL: z.email().default("mentor@example.com"),
  MENTOR_PASSWORD: z.string().min(8).default("Mentor@12345"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", z.flattenError(parsed.error).fieldErrors);
  throw new Error("Invalid environment variables");
}

const env = parsed.data;

const config = {
  env: env.NODE_ENV,
  isProduction: env.NODE_ENV === "production",
  port: env.PORT,
  databaseUrl: env.DATABASE_URL,
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },
  clientUrls: env.CLIENT_URL.split(",").map((url) => url.trim()),
  mentor: {
    name: env.MENTOR_NAME,
    email: env.MENTOR_EMAIL.toLowerCase(),
    password: env.MENTOR_PASSWORD,
  },
} as const;

export default config;

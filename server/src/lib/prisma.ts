import { PrismaPg } from "@prisma/adapter-pg";
import config from "../config/index.js";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: config.databaseUrl });

// Reuse one client per process; in dev, survive `tsx watch` reloads without leaking pools.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (!config.isProduction) globalForPrisma.prisma = prisma;

export default prisma;

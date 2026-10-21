import prisma from "../src/lib/prisma.js";
import { seedMentor } from "../src/utils/seed.js";

seedMentor()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

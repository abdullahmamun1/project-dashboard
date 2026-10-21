import { defineConfig } from "tsup";

export default defineConfig({
  // app.ts is the request handler Vercel serves; server.ts is the local/long-running entry point.
  entry: ["src/app.ts", "src/server.ts"],
  format: ["esm"],
  platform: "node",
  target: "node22",
  outDir: "dist",
  clean: true,
  sourcemap: true,
  // One self-contained file per entry. Vercel's Express builder picks dist/app.js only if that
  // file itself imports "express", which a shared chunk would hide.
  splitting: false,
  // Dependencies stay external (resolved from node_modules at runtime); the generated Prisma
  // client in src/generated is bundled like any other source file.
});

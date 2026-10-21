import type { NextConfig } from "next";

const apiUrl = (process.env.API_URL ?? "http://localhost:4000").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    // client/ is its own npm project (the repo root has no package.json), so pin the root here
    // instead of letting Next.js guess from lockfiles further up the tree.
    root: import.meta.dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // The browser only ever talks to this origin; /api/* is proxied to the Express API. That keeps the
  // httpOnly auth cookie first-party, even though the API is deployed on a different domain.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${apiUrl}/api/:path*` }];
  },
};

export default nextConfig;

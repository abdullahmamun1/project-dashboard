import { Router } from "express";

const router = Router();

// Module routers are mounted here as they're added, e.g. router.use("/auth", authRoutes).
const moduleRoutes: { path: string; route: Router }[] = [];

for (const { path, route } of moduleRoutes) router.use(path, route);

export default router;

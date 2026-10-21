import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route.js";

const router = Router();

const moduleRoutes: { path: string; route: Router }[] = [{ path: "/auth", route: AuthRoutes }];

for (const { path, route } of moduleRoutes) router.use(path, route);

export default router;

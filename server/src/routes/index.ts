import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route.js";
import { SubmissionRoutes } from "../modules/submission/submission.route.js";

const router = Router();

const moduleRoutes: { path: string; route: Router }[] = [
  { path: "/auth", route: AuthRoutes },
  { path: "/submissions", route: SubmissionRoutes },
];

for (const { path, route } of moduleRoutes) router.use(path, route);

export default router;

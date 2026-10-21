import { Router } from "express";
import auth from "../../middleware/auth.js";
import { authLimiter } from "../../middleware/rateLimiter.js";
import validateRequest from "../../middleware/validateRequest.js";
import { AuthController } from "./auth.controller.js";
import { AuthValidation } from "./auth.validation.js";

const router = Router();

router.post("/register", authLimiter, validateRequest({ body: AuthValidation.register }), AuthController.register);
router.post("/login", authLimiter, validateRequest({ body: AuthValidation.login }), AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/me", auth(), AuthController.me);

export const AuthRoutes = router;

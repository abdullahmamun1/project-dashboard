import { Router } from "express";
import { Role } from "../../generated/prisma/enums.js";
import auth from "../../middleware/auth.js";
import validateRequest from "../../middleware/validateRequest.js";
import { SubmissionController } from "./submission.controller.js";
import { SubmissionValidation } from "./submission.validation.js";

const router = Router();

// Student
router.post("/", auth(Role.STUDENT), validateRequest({ body: SubmissionValidation.create }), SubmissionController.create);
router.get("/me", auth(Role.STUDENT), SubmissionController.getMine);

// Mentor
router.get("/stats", auth(Role.MENTOR), SubmissionController.getStats);
router.get(
  "/",
  auth(Role.MENTOR),
  validateRequest({ query: SubmissionValidation.listQuery }),
  SubmissionController.list,
);
router.patch(
  "/:id/review",
  auth(Role.MENTOR),
  validateRequest({ params: SubmissionValidation.idParams, body: SubmissionValidation.review }),
  SubmissionController.review,
);

export const SubmissionRoutes = router;

import express from "express";
import {
  upsertCandidateProfile,
  getMyProfile,
} from "../controllers/candidateProfile.controller.js";
import protect from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { candidateProfileSchema } from "../validations/candidateProfile.validation.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("candidate"),
  validate(candidateProfileSchema),
  upsertCandidateProfile,
);

router.get("/me", protect, authorize("candidate"), getMyProfile);

export default router;

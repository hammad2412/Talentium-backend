import express from "express";

import {
  upsertCandidateProfile,
  getMyProfile,
  deleteMyProfile,
  getMyFullProfile,
} from "../controllers/candidateProfile.controller.js";

import protect from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import { candidateProfileSchema } from "../validations/candidateProfile.validation.js";

const router = express.Router();

router.route("/me").get(protect, authorize("candidate"), getMyProfile);

router
  .route("/full-profile")
  .get(protect, authorize("candidate"), getMyFullProfile);

router
  .route("/")
  .post(
    protect,
    authorize("candidate"),
    validate(candidateProfileSchema),
    upsertCandidateProfile,
  )
  .delete(protect, authorize("candidate"), deleteMyProfile);

export default router;

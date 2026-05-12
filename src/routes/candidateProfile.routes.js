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

import upload from "../middlewares/upload.middleware.js";
import { uploadResume } from "../controllers/candidateProfile.controller.js";

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

router
  .route("/upload-resume")
  .post(protect, authorize("candidate"), upload.single("resume"), uploadResume);

export default router;

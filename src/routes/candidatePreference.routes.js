import express from "express";

import {
  upsertPreferences,
  getMyPreferences,
  deletePreferences,
} from "../controllers/candidatePreference.controller.js";

import protect from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import { candidatePreferenceSchema } from "../validations/candidatePreference.validation.js";

const router = express.Router();

router
  .route("/")
  .get(protect, authorize("candidate"), getMyPreferences)
  .patch(
    protect,
    authorize("candidate"),
    validate(candidatePreferenceSchema),
    upsertPreferences,
  )
  .delete(protect, authorize("candidate"), deletePreferences);

export default router;

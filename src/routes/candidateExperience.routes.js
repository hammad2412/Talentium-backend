import express from "express";

import {
  addExperience,
  getMyExperiences,
  updateExperience,
  deleteExperience,
} from "../controllers/candidateExperience.controller.js";

import protect from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import { candidateExperienceSchema } from "../validations/candidateExperience.validation.js";

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    authorize("candidate"),
    validate(candidateExperienceSchema),
    addExperience,
  )
  .get(protect, authorize("candidate"), getMyExperiences);

router
  .route("/:id")
  .patch(
    protect,
    authorize("candidate"),
    validate(candidateExperienceSchema),
    updateExperience,
  )
  .delete(protect, authorize("candidate"), deleteExperience);

export default router;

import express from "express";

import {
  addEducation,
  getMyEducation,
  updateEducation,
  deleteEducation,
} from "../controllers/candidateEducation.controller.js";

import protect from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import { candidateEducationSchema } from "../validations/candidateEducation.validation.js";

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    authorize("candidate"),
    validate(candidateEducationSchema),
    addEducation,
  )
  .get(protect, authorize("candidate"), getMyEducation);

router
  .route("/:id")
  .patch(
    protect,
    authorize("candidate"),
    validate(candidateEducationSchema),
    updateEducation,
  )
  .delete(protect, authorize("candidate"), deleteEducation);

export default router;

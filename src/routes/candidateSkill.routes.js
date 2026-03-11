import express from "express";

import {
  addSkill,
  getMySkills,
  updateSkill,
  deleteSkill,
} from "../controllers/candidateSkill.controller.js";

import protect from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import { candidateSkillSchema } from "../validations/candidateSkill.validation.js";

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    authorize("candidate"),
    validate(candidateSkillSchema),
    addSkill,
  )
  .get(protect, authorize("candidate"), getMySkills);

router
  .route("/:id")
  .patch(
    protect,
    authorize("candidate"),
    validate(candidateSkillSchema),
    updateSkill,
  )
  .delete(protect, authorize("candidate"), deleteSkill);

export default router;

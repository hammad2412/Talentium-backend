import express from "express";

import {
  addProject,
  getMyProjects,
  updateProject,
  deleteProject,
} from "../controllers/candidateProject.controller.js";

import protect from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import { candidateProjectSchema } from "../validations/candidateProject.validation.js";

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    authorize("candidate"),
    validate(candidateProjectSchema),
    addProject,
  )
  .get(protect, authorize("candidate"), getMyProjects);

router
  .route("/:id")
  .patch(
    protect,
    authorize("candidate"),
    validate(candidateProjectSchema),
    updateProject,
  )
  .delete(protect, authorize("candidate"), deleteProject);

export default router;

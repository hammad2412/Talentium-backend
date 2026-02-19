import express from "express";
import {
  createJob,
  getAllJobs,
  getMyJobs,
  updateJob,
  updateJobStatus,
} from "../controllers/job.controller.js";
import protect from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import pagination from "../middlewares/pagination.middleware.js";
import Job from "../models/Job.model.js";
import {
  createJobSchema,
  updateJobSchema,
} from "../validations/job.validation.js";

const router = express.Router();

/* ================================
   GET ALL JOBS (Candidate)
================================ */
router.get("/", getAllJobs);

/* ================================
   CREATE JOB
================================ */
router.post(
  "/",
  protect,
  authorize("recruiter"),
  validate(createJobSchema),
  createJob,
);

/* ================================
   GET MY JOBS (Recruiter dashboard)
   Supports pagination, sorting, filters
================================ */
router.get(
  "/my-jobs",
  protect,
  authorize("recruiter"),
  pagination(Job),
  getMyJobs,
);

/* ================================
   UPDATE JOB
================================ */
router.put(
  "/:id",
  protect,
  authorize("recruiter"),
  validate(updateJobSchema),
  updateJob,
);

/* ================================
   UPDATE JOB STATUS
================================ */
router.patch("/:id/status", protect, authorize("recruiter"), updateJobStatus);

export default router;

import express from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getMyJobs,
  getSingleJob,
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
router.get("/", authorize("candidate"), pagination(Job), getAllJobs);

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
  pagination(Job, [{ path: "companyId", select: "name" }]),
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

//Get a job
router.get("/:id", protect, authorize("recruiter"), getSingleJob);

//Detele a job
router.delete("/:id", protect, authorize("recruiter"), deleteJob);

/* ================================
   UPDATE JOB STATUS
================================ */
router.patch("/:id/status", protect, authorize("recruiter"), updateJobStatus);

export default router;

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

router.get(
  "/",
  protect,
  authorize("candidate"),
  pagination(Job, [{ path: "companyId", select: "name" }]),
  getAllJobs,
);

router.post(
  "/",
  protect,
  authorize("recruiter"),
  validate(createJobSchema),
  createJob,
);
router.get(
  "/my-jobs",
  protect,
  authorize("recruiter"),
  pagination(Job, [{ path: "companyId", select: "name" }], (req) => ({
    recruiterId: req.user._id,
  })),
  getMyJobs,
);

router.put(
  "/:id",
  protect,
  authorize("recruiter"),
  validate(updateJobSchema),
  updateJob,
);

router.get("/:id", protect, authorize("recruiter"), getSingleJob);

router.delete("/:id", protect, authorize("recruiter"), deleteJob);

router.patch("/:id/status", protect, authorize("recruiter"), updateJobStatus);

export default router;

import express from "express";
import {
  applyJob,
  getJobApplications,
  updateApplicationStatus,
} from "../controllers/application.controller.js";
import protect from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  applyJobSchema,
  updateApplicationStatusSchema,
} from "../validations/application.validation.js";
import pagination from "../middlewares/pagination.middleware.js";
import Application from "../models/Application.model.js";

const router = express.Router();

/* candidate */
router.post(
  "/apply/:jobId",
  protect,
  authorize("candidate"),
  validate(applyJobSchema),
  applyJob,
);

/* recruiter */
//view job applications & supports pagonation, sorting, filtering
router.get(
  "/jobs/:jobId",
  protect,
  authorize("recruiter"),
  (req, res, next) => {
    // enforce recruiter & job filter
    req.query.jobId = req.params.jobId;
    req.query.recruiterId = req.user._id;
    next();
  },
  pagination(Application, [
    { path: "candidateId", select: "name email" },
    { path: "candidateProfileId" },
  ]),
  getJobApplications,
);

//update application status
router.patch(
  "/:id/status",
  protect,
  authorize("recruiter"),
  validate(updateApplicationStatusSchema),
  updateApplicationStatus,
);

export default router;

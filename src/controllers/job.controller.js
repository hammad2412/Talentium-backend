import pagination from "../middlewares/pagination.middleware.js";
import Job from "../models/Job.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

/* ================================
   GET ALL OPEN JOBS (Candidate)
================================ */
export const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ status: "open", ...req.query })
    .populate("companyId", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    pagination,
    count: jobs.length,
    data: jobs,
  });
});

/* ================================
   CREATE JOB (Recruiter only)
================================ */
export const createJob = asyncHandler(async (req, res) => {
  const recruiter = req.user;

  // recruiter must have company
  if (!recruiter.companyId) {
    throw new ErrorResponse("Please create a company before posting jobs", 400);
  }

  const job = await Job.create({
    ...req.body,
    companyId: recruiter.companyId,
    recruiterId: recruiter._id,
  });

  res.status(201).json({
    success: true,
    data: job,
  });
});

/* ================================
   GET MY JOBS (Recruiter dashboard)
   Pagination handled by middleware
================================ */
export const getMyJobs = asyncHandler(async (req, res) => {
  res.status(200).json(res.pagination);
});

/* ================================
   UPDATE JOB
================================ */
export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({
    _id: req.params.id,
    recruiterId: req.user._id,
  });

  if (!job) {
    throw new ErrorResponse("Job not found", 404);
  }

  Object.assign(job, req.body);
  await job.save();

  res.status(200).json({
    success: true,
    data: job,
  });
});

/* ================================
   UPDATE JOB STATUS
================================ */
export const updateJobStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["open", "closed", "paused"].includes(status)) {
    throw new ErrorResponse("Invalid status", 400);
  }

  const job = await Job.findOneAndUpdate(
    {
      _id: req.params.id,
      recruiterId: req.user._id,
    },
    { status },
    { new: true },
  );

  if (!job) {
    throw new ErrorResponse("Job not found", 404);
  }

  res.status(200).json({
    success: true,
    data: job,
  });
});

/* ================================
   GET SINGLE JOB (Recruiter)
================================ */
export const getSingleJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({
    _id: req.params.id,
    recruiterId: req.user._id,
  });

  if (!job) {
    throw new ErrorResponse("Job not found", 404);
  }

  res.status(200).json({
    success: true,
    data: job,
  });
});

/* ================================
   DELETE JOB
================================ */
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findOneAndDelete({
    _id: req.params.id,
    recruiterId: req.user._id,
  });

  if (!job) {
    throw new ErrorResponse("Job not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Job deleted successfully",
  });
});

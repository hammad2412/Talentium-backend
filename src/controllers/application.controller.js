import Application from "../models/Application.model.js";
import Job from "../models/Job.model.js";
import CandidateProfile from "../models/CandidateProfile.model.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/* ================================
   CANDIDATE APPLIES TO JOB
================================ */
export const applyJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);

  if (!job || job.status !== "open") {
    throw new ErrorResponse("Job not available", 404);
  }

  const profile = await CandidateProfile.findOne({
    userId: req.user._id,
  });

  if (!profile) {
    throw new ErrorResponse("Complete your profile before applying", 400);
  }

  const application = await Application.create({
    jobId: job._id,
    candidateId: req.user._id,
    recruiterId: job.recruiterId,
    companyId: job.companyId,
    candidateProfileId: profile._id,
    coverLetter: req.body.coverLetter,
  });

  job.applicationsCount += 1;
  await job.save();

  res.status(201).json({
    success: true,
    data: application,
  });
});

/* ================================
   RECRUITER VIEWS APPLICATIONS
   Pagination handled by middleware
================================ */
export const getJobApplications = asyncHandler(async (req, res) => {
  res.status(200).json(res.pagination);
});

/* ================================
   UPDATE APPLICATION STATUS
================================ */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["reviewed", "shortlisted", "rejected"].includes(status)) {
    throw new ErrorResponse("Invalid status", 400);
  }

  const application = await Application.findOneAndUpdate(
    {
      _id: req.params.id,
      recruiterId: req.user._id,
    },
    { status },
    { new: true },
  );

  if (!application) {
    throw new ErrorResponse("Application not found", 404);
  }

  res.status(200).json({
    success: true,
    data: application,
  });
});

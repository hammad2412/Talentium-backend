import CandidateProject from "../models/CandidateProject.model.js";
import CandidateProfile from "../models/CandidateProfile.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import calculateProfileCompletion from "../utils/profileCompletion.js";

const getProfile = async (userId) => {
  const profile = await CandidateProfile.findOne({ userId });

  if (!profile) {
    throw new ErrorResponse("Candidate profile not found", 404);
  }

  return profile;
};

export const addProject = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user._id);

  const project = await CandidateProject.create({
    ...req.body,
    candidateId: profile._id,
  });

  await calculateProfileCompletion(profile._id);

  res.status(201).json({
    success: true,
    project,
  });
});

export const getMyProjects = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user._id);

  const projects = await CandidateProject.find({
    candidateId: profile._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: projects.length,
    projects,
  });
});

export const updateProject = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user._id);

  const project = await CandidateProject.findOneAndUpdate(
    { _id: req.params.id, candidateId: profile._id },
    req.body,
    { new: true, runValidators: true },
  );

  if (!project) {
    throw new ErrorResponse("Project not found or unauthorized", 404);
  }

  await calculateProfileCompletion(profile._id);

  res.status(200).json({
    success: true,
    project,
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user._id);

  const project = await CandidateProject.findOneAndDelete({
    _id: req.params.id,
    candidateId: profile._id,
  });

  if (!project) {
    throw new ErrorResponse("Project not found or unauthorized", 404);
  }

  await calculateProfileCompletion(profile._id);

  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });
});

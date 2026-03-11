import CandidateExperience from "../models/CandidateExperience.model.js";
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

export const addExperience = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user._id);

  const experience = await CandidateExperience.create({
    ...req.body,
    candidateId: profile._id,
  });

  await calculateProfileCompletion(profile._id);

  res.status(201).json({
    success: true,
    experience,
  });
});

export const getMyExperiences = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user._id);

  const experiences = await CandidateExperience.find({
    candidateId: profile._id,
  }).sort({ startYear: -1 });

  res.status(200).json({
    success: true,
    count: experiences.length,
    experiences,
  });
});

export const updateExperience = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user._id);

  const experience = await CandidateExperience.findOneAndUpdate(
    { _id: req.params.id, candidateId: profile._id },
    req.body,
    { new: true, runValidators: true },
  );

  if (!experience) {
    throw new ErrorResponse("Experience not found or unauthorized", 404);
  }

  await calculateProfileCompletion(profile._id);

  res.status(200).json({
    success: true,
    experience,
  });
});

export const deleteExperience = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user._id);

  const experience = await CandidateExperience.findOneAndDelete({
    _id: req.params.id,
    candidateId: profile._id,
  });

  if (!experience) {
    throw new ErrorResponse("Experience not found or unauthorized", 404);
  }

  await calculateProfileCompletion(profile._id);

  res.status(200).json({
    success: true,
    message: "Experience deleted successfully",
  });
});

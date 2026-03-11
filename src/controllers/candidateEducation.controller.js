import CandidateEducation from "../models/CandidateEducation.model.js";
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

export const addEducation = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user._id);

  const education = await CandidateEducation.create({
    ...req.body,
    candidateId: profile._id,
  });

  await calculateProfileCompletion(profile._id);

  res.status(201).json({
    success: true,
    education,
  });
});

export const getMyEducation = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user._id);

  const education = await CandidateEducation.find({
    candidateId: profile._id,
  }).sort({ startYear: -1 });

  res.status(200).json({
    success: true,
    count: education.length,
    education,
  });
});

export const updateEducation = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user._id);

  const education = await CandidateEducation.findOneAndUpdate(
    { _id: req.params.id, candidateId: profile._id },
    req.body,
    { new: true, runValidators: true },
  );

  if (!education) {
    throw new ErrorResponse("Education not found or unauthorized", 404);
  }

  await calculateProfileCompletion(profile._id);

  res.status(200).json({
    success: true,
    education,
  });
});

export const deleteEducation = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user._id);

  const education = await CandidateEducation.findOneAndDelete({
    _id: req.params.id,
    candidateId: profile._id,
  });

  if (!education) {
    throw new ErrorResponse("Education not found or unauthorized", 404);
  }

  await calculateProfileCompletion(profile._id);

  res.status(200).json({
    success: true,
    message: "Education deleted successfully",
  });
});

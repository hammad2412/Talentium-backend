import CandidateProfile from "../models/CandidateProfile.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

/* create or update profile */
export const upsertCandidateProfile = asyncHandler(async (req, res) => {
  const profile = await CandidateProfile.findOneAndUpdate(
    { userId: req.user._id },
    { ...req.body, userId: req.user._id },
    { new: true, upsert: true },
  );

  res.json({
    success: true,
    profile,
  });
});

/* get my profile */
export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await CandidateProfile.findOne({
    userId: req.user._id,
  }).populate("userId", "name email");

  if (!profile) {
    throw new ErrorResponse("Profile not found", 404);
  }

  res.status(200).json({
    success: true,
    profile,
  });
});

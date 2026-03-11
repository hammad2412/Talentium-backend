import CandidatePreference from "../models/CandidatePreference.model.js";
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

export const upsertPreferences = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user._id);

  const preferences = await CandidatePreference.findOneAndUpdate(
    { candidateId: profile._id },
    {
      ...req.body,
      candidateId: profile._id,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    },
  );

  await calculateProfileCompletion(profile._id);

  res.status(200).json({
    success: true,
    preferences,
  });
});

export const getMyPreferences = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user._id);

  const preferences = await CandidatePreference.findOne({
    candidateId: profile._id,
  });

  res.status(200).json({
    success: true,
    preferences,
  });
});

export const deletePreferences = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user._id);

  const preferences = await CandidatePreference.findOneAndDelete({
    candidateId: profile._id,
  });

  if (!preferences) {
    throw new ErrorResponse("Preferences not found", 404);
  }

  await calculateProfileCompletion(profile._id);

  res.status(200).json({
    success: true,
    message: "Preferences deleted successfully",
  });
});

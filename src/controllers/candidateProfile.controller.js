import CandidateProfile from "../models/CandidateProfile.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import calculateProfileCompletion from "../utils/profileCompletion.js";
import CandidateSkill from "../models/CandidateSkill.model.js";
import CandidateEducation from "../models/CandidateEducation.model.js";
import CandidateExperience from "../models/CandidateExperience.model.js";
import CandidateProject from "../models/CandidateProject.model.js";
import CandidatePreference from "../models/CandidatePreference.model.js";
import User from "../models/User.model.js";

export const upsertCandidateProfile = asyncHandler(async (req, res) => {
  const { name, email, ...profileData } = req.body;

  if (name || email) {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(name && { name }),
        ...(email && { email }),
      },
      { new: true },
    );
  }

  const profile = await CandidateProfile.findOneAndUpdate(
    { userId: req.user._id },
    {
      ...profileData,
      userId: req.user._id,
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
    profile,
  });
});

export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await CandidateProfile.findOne({
    userId: req.user._id,
  }).populate("userId", "name email");

  res.status(200).json({
    success: true,
    profile: profile || null,
  });
});

export const getMyFullProfile = asyncHandler(async (req, res) => {
  const profile = await CandidateProfile.findOne({
    userId: req.user._id,
  }).populate("userId", "name email");

  if (!profile) {
    return res.status(200).json({
      success: true,
      data: {
        user: {
          name: req.user.name,
          email: req.user.email,
        },
        profile: null,
        skills: [],
        education: [],
        experience: [],
        projects: [],
        preferences: null,
      },
    });
  }

  const candidateId = profile._id;

  const [skills, education, experience, projects, preferences] =
    await Promise.all([
      CandidateSkill.find({ candidateId }),
      CandidateEducation.find({ candidateId }),
      CandidateExperience.find({ candidateId }).sort({ startYear: -1 }),
      CandidateProject.find({ candidateId }).sort({ startYear: -1 }),
      CandidatePreference.findOne({ candidateId }),
    ]);

  res.status(200).json({
    success: true,
    data: {
      user: profile.userId,
      profile,
      skills,
      education,
      experience,
      projects,
      preferences,
      profileCompletion: profile.profileCompletion,
    },
  });
});

export const deleteMyProfile = asyncHandler(async (req, res) => {
  const profile = await CandidateProfile.findOneAndDelete({
    userId: req.user._id,
  });

  if (!profile) {
    throw new ErrorResponse("Profile not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Profile deleted successfully",
  });
});

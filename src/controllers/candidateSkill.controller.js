import CandidateSkill from "../models/CandidateSkill.model.js";
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

export const addSkill = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user._id);

  const skill = await CandidateSkill.create({
    ...req.body,
    candidateId: profile._id,
  });

  await calculateProfileCompletion(profile._id);

  res.status(201).json({
    success: true,
    skill,
  });
});

export const getMySkills = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user._id);

  const skills = await CandidateSkill.find({
    candidateId: profile._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: skills.length,
    skills,
  });
});

export const updateSkill = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user._id);

  const skill = await CandidateSkill.findOneAndUpdate(
    { _id: req.params.id, candidateId: profile._id },
    req.body,
    { new: true, runValidators: true },
  );

  if (!skill) {
    throw new ErrorResponse("Skill not found or unauthorized", 404);
  }

  await calculateProfileCompletion(profile._id);

  res.status(200).json({
    success: true,
    skill,
  });
});

export const deleteSkill = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user._id);

  const skill = await CandidateSkill.findOneAndDelete({
    _id: req.params.id,
    candidateId: profile._id,
  });

  if (!skill) {
    throw new ErrorResponse("Skill not found or unauthorized", 404);
  }

  await calculateProfileCompletion(profile._id);

  res.status(200).json({
    success: true,
    message: "Skill removed successfully",
  });
});

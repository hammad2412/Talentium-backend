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
import { uploadToS3 } from "../Services/uploadToS3.js";
import extractResumeText from "../Services/extractResumeText.js";
import { parseResumeWithAI } from "../Services/geminiService.js";

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

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    // 1. Upload file to AWS S3
    const { key, url } = await uploadToS3(req.file, req.user.id);

    // 2. Extract text from PDF/DOCX
    const resumeText = await extractResumeText(req.file);

    // 3. Parse resume using Gemini AI
    const parsedData = await parseResumeWithAI(resumeText);

    // 4. Create or update candidate profile
    const profile = await CandidateProfile.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId: req.user.id,
        headline: parsedData.headline || "",
        resume: {
          key,
          url,
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          uploadedAt: new Date(),
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    const candidateId = profile._id;

    // 5. Replace existing skills with parsed skills
    await CandidateSkill.deleteMany({ candidateId });

    if (Array.isArray(parsedData.skills) && parsedData.skills.length > 0) {
      const skillDocs = parsedData.skills.map((skill) => ({
        candidateId,
        skillName: skill.trim(), // Required field
        proficiency: "intermediate", // Optional default value
        yearsExperience: 0, // Optional default value
      }));

      await CandidateSkill.insertMany(skillDocs);
    }
    // 6. Recalculate profile completion
    await calculateProfileCompletion(candidateId);

    // 7. Return success response
    res.status(200).json({
      success: true,
      message: "Resume uploaded and parsed successfully",
      data: {
        headline: parsedData.headline,
        skills: parsedData.skills,
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

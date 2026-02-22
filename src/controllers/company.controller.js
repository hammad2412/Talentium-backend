import Company from "../models/Company.model.js";
import User from "../models/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

/* ================================
   CREATE COMPANY (Recruiter only)
   Safe Version - Production Ready
================================ */
export const createCompany = asyncHandler(async (req, res) => {
  const recruiterId = req.user._id;

  /* ---------------------------------------------------
     STEP 1: Check if company already exists in DB
     (Do NOT trust req.user.companyId blindly)
  --------------------------------------------------- */
  const existingCompany = await Company.findOne({
    createdBy: recruiterId,
  });

  // If company document exists → block creation
  if (existingCompany) {
    throw new ErrorResponse("Company already exists for this recruiter", 400);
  }

  // If user has companyId but company does not exist → clean stale reference
  if (req.user.companyId && !existingCompany) {
    await User.findByIdAndUpdate(recruiterId, {
      $unset: { companyId: "" },
    });
  }

  /* ---------------------------------------------------
     STEP 2: Create new company
  --------------------------------------------------- */
  const { name, logo, website, industry, size, location, description } =
    req.body;

  const company = await Company.create({
    name,
    logo,
    website,
    industry,
    size,
    location,
    description,
    createdBy: recruiterId,
  });

  /* ---------------------------------------------------
     STEP 3: Attach companyId to recruiter user
     (This ensures future quick lookups)
  --------------------------------------------------- */
  await User.findByIdAndUpdate(recruiterId, {
    companyId: company._id,
  });

  /* ---------------------------------------------------
     STEP 4: Return success response
  --------------------------------------------------- */
  res.status(201).json({
    success: true,
    company,
  });
});

/* ================================
   GET MY COMPANY (Recruiter)
================================ */
export const getMyCompany = asyncHandler(async (req, res) => {
  const company = await Company.findOne({
    createdBy: req.user._id,
  });

  if (!company) {
    throw new ErrorResponse("Company not found", 404);
  }

  res.status(200).json({
    success: true,
    data: company,
  });
});

/* ================================
   UPDATE COMPANY
================================ */
export const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findOneAndUpdate(
    { createdBy: req.user._id },
    req.body,
    { new: true },
  );

  if (!company) {
    throw new ErrorResponse("Company not found", 404);
  }

  res.status(200).json({
    success: true,
    data: company,
  });
});

import Company from "../models/Company.model.js";
import User from "../models/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

export const createCompany = asyncHandler(async (req, res) => {
  const recruiterId = req.user._id;

  const existingCompany = await Company.findOne({
    createdBy: recruiterId,
  });

  if (existingCompany) {
    throw new ErrorResponse("Company already exists for this recruiter", 400);
  }

  if (req.user.companyId && !existingCompany) {
    await User.findByIdAndUpdate(recruiterId, {
      $unset: { companyId: "" },
    });
  }

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

  await User.findByIdAndUpdate(recruiterId, {
    companyId: company._id,
  });

  res.status(201).json({
    success: true,
    company,
  });
});

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

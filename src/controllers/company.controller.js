import Company from "../models/Company.model.js";
import User from "../models/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

/* Create company (Recruiter only) */
export const createCompany = asyncHandler(async (req, res) => {
  const recruiterId = req.user._id;

  // recruiter already has company?
  if (req.user.companyId) {
    throw new ErrorResponse("Company already exists for this recruiter", 400);
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

  // attach company to recruiter
  await User.findByIdAndUpdate(recruiterId, {
    companyId: company._id,
  });

  res.status(201).json({
    success: true,
    company,
  });
});

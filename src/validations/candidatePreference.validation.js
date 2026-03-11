import Joi from "joi";

export const candidatePreferenceSchema = Joi.object({
  preferredLocations: Joi.array().items(Joi.string()).optional(),

  expectedSalary: Joi.number().min(0).optional(),

  jobType: Joi.string()
    .valid("full-time", "part-time", "internship", "contract", "freelance")
    .optional(),

  remotePreference: Joi.string().valid("remote", "hybrid", "onsite").optional(),

  noticePeriod: Joi.string()
    .valid("immediate", "15-days", "30-days", "60-days", "90-days")
    .optional(),

  willingToRelocate: Joi.boolean().optional(),
});

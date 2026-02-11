import Joi from "joi";

export const applyJobSchema = Joi.object({
  coverLetter: Joi.string().optional(),
});

export const updateApplicationStatusSchema = Joi.object({
  status: Joi.string().valid("reviewed", "shortlisted", "rejected").required(),
});

import Joi from "joi";

export const createJobSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  requirements: Joi.string().optional(),
  skillsRequired: Joi.array().items(Joi.string()).min(1).required(),
  experienceLevel: Joi.string().valid("fresher", "mid", "senior").required(),
  jobType: Joi.string()
    .valid("full-time", "part-time", "internship", "contract")
    .required(),
  salaryRange: Joi.string().optional(),
  location: Joi.string().required(),
  isRemote: Joi.boolean().optional(),
});

export const updateJobSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  requirements: Joi.string().optional(),
  skillsRequired: Joi.array().items(Joi.string()).optional(),
  experienceLevel: Joi.string().valid("fresher", "mid", "senior").optional(),
  jobType: Joi.string()
    .valid("full-time", "part-time", "internship", "contract")
    .optional(),
  salaryRange: Joi.string().optional(),
  location: Joi.string().optional(),
  isRemote: Joi.boolean().optional(),
});

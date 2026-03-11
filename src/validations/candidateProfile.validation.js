import Joi from "joi";

export const candidateProfileSchema = Joi.object({
  name: Joi.string().max(80).optional(),

  email: Joi.string().email().optional(),

  headline: Joi.string().max(120).allow("").optional(),

  about: Joi.string().max(1000).allow("").optional(),

  currentRole: Joi.string().allow("").optional(),

  currentCompany: Joi.string().allow("").optional(),

  currentLocation: Joi.string().allow("").optional(),

  totalExperience: Joi.number().min(0).optional(),

  primarySkills: Joi.array().items(Joi.string()).optional(),

  openToWork: Joi.boolean().optional(),

  profileVisibility: Joi.string()
    .valid("public", "recruitersOnly", "private")
    .optional(),
});

import Joi from "joi";

export const candidateProfileSchema = Joi.object({
  headline: Joi.string().optional(),
  summary: Joi.string().optional(),
  experienceYears: Joi.number().min(0).optional(),
  skills: Joi.array().items(Joi.string()).optional(),

  education: Joi.array()
    .items(
      Joi.object({
        degree: Joi.string().required(),
        institution: Joi.string().required(),
        startYear: Joi.number().required(),
        endYear: Joi.number().optional(),
      }),
    )
    .optional(),

  experience: Joi.array()
    .items(
      Joi.object({
        company: Joi.string().required(),
        role: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().optional(),
        description: Joi.string().optional(),
      }),
    )
    .optional(),

  projects: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().required(),
        description: Joi.string().optional(),
        techStack: Joi.array().items(Joi.string()).optional(),
        link: Joi.string().uri().optional(),
      }),
    )
    .optional(),
});

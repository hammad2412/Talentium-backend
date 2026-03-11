import Joi from "joi";

export const candidateProjectSchema = Joi.object({
  title: Joi.string().required(),

  description: Joi.string().required(),

  techStack: Joi.array().items(Joi.string()).required(),

  githubLink: Joi.string().uri().required(),

  liveLink: Joi.string().uri().optional(),

  role: Joi.string().required(),

  startMonth: Joi.string().required(),
  startYear: Joi.number().required(),
  endMonth: Joi.string().allow(null, ""),
  endYear: Joi.number().allow(null),
  currentlyWorking: Joi.boolean(),
});

import Joi from "joi";

export const candidateEducationSchema = Joi.object({
  degree: Joi.string().required(),
  fieldOfStudy: Joi.string().optional(),
  institution: Joi.string().required(),
  startMonth: Joi.string().required(),
  startYear: Joi.number().required(),
  endMonth: Joi.string().allow(null, ""),
  endYear: Joi.number().allow(null),
  currentlyStudying: Joi.boolean(),
  grade: Joi.string().optional(),
});

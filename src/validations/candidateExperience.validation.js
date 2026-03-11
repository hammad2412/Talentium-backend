import Joi from "joi";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const employmentTypes = [
  "full-time",
  "part-time",
  "internship",
  "contract",
  "freelance",
];

export const candidateExperienceSchema = Joi.object({
  company: Joi.string().trim().required().messages({
    "string.empty": "Company name is required",
  }),

  role: Joi.string().trim().required().messages({
    "string.empty": "Role is required",
  }),

  employmentType: Joi.string()
    .valid(...employmentTypes)
    .optional(),

  location: Joi.string().trim().allow("").optional(),

  startMonth: Joi.string()
    .valid(...months)
    .required(),

  startYear: Joi.number()
    .integer()
    .min(2000)
    .max(new Date().getFullYear())
    .required(),

  endMonth: Joi.string()
    .valid(...months)
    .allow(null, "")
    .optional(),

  endYear: Joi.number()
    .integer()
    .min(2000)
    .max(new Date().getFullYear())
    .allow(null)
    .optional(),

  currentlyWorking: Joi.boolean().optional(),

  description: Joi.string().max(1000).allow("").optional(),

  skillsUsed: Joi.array().items(Joi.string().trim()).optional(),
});

import Joi from "joi";

export const createCompanySchema = Joi.object({
  name: Joi.string().required(),
  website: Joi.string().uri().optional(),
  industry: Joi.string().optional(),
  size: Joi.string().optional(),
  location: Joi.string().optional(),
  description: Joi.string().optional(),
});

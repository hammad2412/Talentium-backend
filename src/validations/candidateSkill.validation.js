import Joi from "joi";

export const candidateSkillSchema = Joi.object({
  skillName: Joi.string().required(),

  proficiency: Joi.string()
    .valid("beginner", "intermediate", "advanced", "expert")
    .optional(),

  yearsExperience: Joi.number().min(0).optional(),
});

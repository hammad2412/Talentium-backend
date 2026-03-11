import mongoose from "../lib/mongoose.js";

const candidateSkillSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CandidateProfile",
      required: true,
    },

    skillName: {
      type: String,
      required: true,
      trim: true,
    },

    proficiency: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      default: "intermediate",
    },

    yearsExperience: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

/*
Prevent duplicate skills per candidate
*/
candidateSkillSchema.index({ candidateId: 1, skillName: 1 }, { unique: true });

export default mongoose.model("CandidateSkill", candidateSkillSchema);

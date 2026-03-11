import mongoose from "../lib/mongoose.js";

const candidateExperienceSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CandidateProfile",
      required: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract", "freelance"],
      default: "full-time",
    },

    location: {
      type: String,
      trim: true,
    },

    startMonth: {
      type: String,
      enum: [
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
      ],
      required: true,
    },

    startYear: {
      type: Number,
      required: true,
    },

    endMonth: {
      type: String,
      enum: [
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
      ],
    },

    endYear: {
      type: Number,
    },

    currentlyWorking: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      maxlength: 1000,
    },

    skillsUsed: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model("CandidateExperience", candidateExperienceSchema);

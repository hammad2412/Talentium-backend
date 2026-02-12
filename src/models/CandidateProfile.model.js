import mongoose from "../lib/mongoose.js";

const candidateProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    headline: {
      type: String,
      trim: true,
    },

    summary: {
      type: String,
    },

    experienceYears: {
      type: Number,
      default: 0,
    },

    skills: {
      type: [String],
      default: [],
    },

    education: [
      {
        degree: String,
        institution: String,
        startYear: Number,
        endYear: Number,
      },
    ],

    experience: [
      {
        company: String,
        role: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],

    projects: [
      {
        title: String,
        description: String,
        techStack: [String],
        link: String,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("CandidateProfile", candidateProfileSchema);

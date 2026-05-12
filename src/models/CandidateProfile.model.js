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
      maxlength: 120,
    },

    about: {
      type: String,
      maxlength: 1000,
    },

    currentRole: {
      type: String,
      trim: true,
    },

    currentCompany: {
      type: String,
      trim: true,
    },

    currentLocation: {
      type: String,
      trim: true,
    },

    totalExperience: {
      type: Number,
      default: 0,
    },

    primarySkills: {
      type: [String],
      default: [],
    },

    profileCompletion: {
      type: Number,
      default: 10,
      min: 0,
      max: 100,
    },

    openToWork: {
      type: Boolean,
      default: true,
    },

    profileVisibility: {
      type: String,
      enum: ["public", "recruitersOnly", "private"],
      default: "public",
    },

    profileSlug: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
  },
  { timestamps: true },

  {
    resume: {
      url: {
        type: String,
        default: "",
      },
      key: {
        type: String,
        default: "",
      },
      originalName: {
        type: String,
        default: "",
      },
      size: {
        type: Number,
        default: 0,
      },
      mimetype: {
        type: String,
        default: "",
      },
      uploadedAt: {
        type: Date,
      },
    },
  },
);

export default mongoose.model("CandidateProfile", candidateProfileSchema);

import mongoose from "../lib/mongoose.js";

const candidatePreferenceSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CandidateProfile",
      required: true,
      unique: true,
    },

    preferredLocations: {
      type: [String],
      default: [],
    },

    expectedSalary: {
      type: Number,
      min: 0,
    },

    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract", "freelance"],
    },

    remotePreference: {
      type: String,
      enum: ["remote", "hybrid", "onsite"],
    },

    noticePeriod: {
      type: String,
      enum: ["immediate", "15-days", "30-days", "60-days", "90-days"],
    },

    willingToRelocate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("CandidatePreference", candidatePreferenceSchema);

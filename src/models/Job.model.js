import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    requirements: {
      type: String,
    },

    skillsRequired: {
      type: [String],
      required: true,
    },

    experienceLevel: {
      type: String,
      enum: ["fresher", "mid", "senior"],
      required: true,
    },

    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract"],
      required: true,
    },

    salaryRange: {
      type: String,
    },

    location: {
      type: String,
      required: true,
    },

    isRemote: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["open", "closed", "paused"],
      default: "open",
    },
    //Recruiter must have a company
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    //only recruiter can create job
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    applicationsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Job", jobSchema);

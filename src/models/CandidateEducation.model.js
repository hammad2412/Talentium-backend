import mongoose from "../lib/mongoose.js";

const candidateEducationSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CandidateProfile",
      required: true,
    },

    degree: {
      type: String,
      required: true,
      trim: true,
    },

    fieldOfStudy: {
      type: String,
      trim: true,
    },

    institution: {
      type: String,
      required: true,
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

    currentlyStudying: {
      type: Boolean,
      default: false,
    },

    grade: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("CandidateEducation", candidateEducationSchema);

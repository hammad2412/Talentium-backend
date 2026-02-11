import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    logo: {
      type: String,
    },

    website: {
      type: String,
    },

    industry: {
      type: String,
    },

    size: {
      type: String, // "1-10", "11-50", "51-200", etc
    },

    location: {
      type: String,
    },

    description: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Company", companySchema);

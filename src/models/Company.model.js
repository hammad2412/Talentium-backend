import mongoose from "../lib/mongoose.js";

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
      type: String,
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

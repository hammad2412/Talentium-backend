import mongoose from "mongoose";
import CandidateProfile from "../models/CandidateProfile.model.js";

const calculateProfileCompletion = async (candidateId) => {
  const objectId = new mongoose.Types.ObjectId(candidateId);

  const result = await CandidateProfile.aggregate([
    { $match: { _id: objectId } },

    {
      $lookup: {
        from: "candidateskills",
        localField: "_id",
        foreignField: "candidateId",
        as: "skills",
      },
    },

    {
      $lookup: {
        from: "candidateeducations",
        localField: "_id",
        foreignField: "candidateId",
        as: "education",
      },
    },

    {
      $lookup: {
        from: "candidateexperiences",
        localField: "_id",
        foreignField: "candidateId",
        as: "experience",
      },
    },

    {
      $lookup: {
        from: "candidateprojects",
        localField: "_id",
        foreignField: "candidateId",
        as: "projects",
      },
    },

    {
      $lookup: {
        from: "candidatepreferences",
        localField: "_id",
        foreignField: "candidateId",
        as: "preferences",
      },
    },
  ]);

  const data = result[0];

  let completion = 0;

  if (
    data.headline ||
    data.about ||
    (data.primarySkills && data.primarySkills.length > 0)
  ) {
    completion += 20;
  }

  if (data.skills.length > 0) completion += 20;
  if (data.education.length > 0) completion += 15;
  if (data.experience.length > 0) completion += 25;
  if (data.projects.length > 0) completion += 10;
  if (data.preferences.length > 0) completion += 10;

  await CandidateProfile.findByIdAndUpdate(objectId, {
    profileCompletion: completion,
  });

  return completion;
};

export default calculateProfileCompletion;

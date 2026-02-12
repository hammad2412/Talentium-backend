import User from "../models/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import CandidateProfile from "../models/CandidateProfile.model.js";

// GET ALL USERS
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken");

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// DELETE USER

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }

  // If candidate → delete profile
  if (user.role === "candidate") {
    await CandidateProfile.findOneAndDelete({ userId: user._id });
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User and related data deleted successfully",
  });
});

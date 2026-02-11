import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import ErrorResponse from "../utils/ErrorResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

//LOGIN
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password +refreshToken");

  if (!user || !(await user.matchPassword(password))) {
    throw new ErrorResponse("Invalid Credentials", 401);
  }

  // generate tokens
  const accessToken = user.getAccessToken();
  const refreshToken = user.getRefreshToken();

  // hash refresh token before saving
  user.refreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
    },
  });
});

//REGISTER CANDIDATE
export const registerCandidate = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    throw new ErrorResponse("User already exists", 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    role: "candidate",
  });

  const accessToken = user.getAccessToken();
  const refreshToken = user.getRefreshToken();

  user.refreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await user.save({ validateBeforeSave: false });

  res.status(201).json({
    success: true,
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
    },
  });
});

//REGISTER RECRUITER
export const registerRecruiter = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    throw new ErrorResponse("User already exists", 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    role: "recruiter",
  });

  const accessToken = user.getAccessToken();
  const refreshToken = user.getRefreshToken();

  user.refreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await user.save({ validateBeforeSave: false });

  res.status(201).json({
    success: true,
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
    },
  });
});

//REFRESH ACCESS TOKEN

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ErrorResponse("Refresh token required", 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new ErrorResponse("Invalid refresh token", 401);
  }

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const user = await User.findOne({
    _id: decoded.id,
    refreshToken: hashedRefreshToken,
  });

  if (!user) {
    throw new ErrorResponse("Token reuse detected", 401);
  }

  const newAccessToken = user.getAccessToken();
  const newRefreshToken = user.getRefreshToken();

  user.refreshToken = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
});

//LOGOUT
export const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  user.refreshToken = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

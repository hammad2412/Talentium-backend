// protect → verifies ACCESS TOKEN, attaches user to req.user

import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ErrorResponse("Not authorized, no access token", 401);
  }

  try {
    // VERIFY ACCESS TOKEN (IMPORTANT)
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user || !user.isActive) {
      throw new ErrorResponse("User not active", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ErrorResponse("Access token invalid or expired", 401);
  }
});

export default protect;

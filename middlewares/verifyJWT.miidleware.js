import asyncHandler from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/Apiresponse.js';
import { ApiError } from '../utils/Apierror.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

const verifyJwt = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.accessToken;
  const authHeader = req.header("Authorization");

  // Safely extract token from the Authorization header if not in cookies
  if (!token && authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError(401, "Unauthorized request: No token provided"));
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return next(new ApiError(401, "Unauthorized request: Invalid token"));
  }

  // Optional: Check if the decoded token contains required data
  if (!decodedToken || !decodedToken._id) {
    return next(new ApiError(401, "Unauthorized request: Token missing required data"));
  }

  const user = await User.findById(decodedToken._id).select("-password -refreshToken");
  if (!user) {
    return next(new ApiError(401, "Unauthorized request: User not found"));
  }

  req.user = user;
  next();
});

export { verifyJwt };

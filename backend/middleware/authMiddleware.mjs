import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User } from "../models/models.mjs";
const verify = jwt.verify;

/**
 * Protect routes using JWT-based authentication.
 *
 * If process.env.DEBUG is "true", bypass token verification
 * and assign a dummy user.
 *
 * Expects an Authorization header with the format: "Bearer <token>"
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    typeof req.cookies?.token == "string"
  ) {
    try {
      token = req.cookies.token; // extract token
      const decoded = verify(req.cookies.token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);

      if (!user) {
        return res
          .status(401)
          .json({ error: "Not authorized, user not found" });
      }

      req.user = user;
      return next();
    } catch (error) {
      return res
        .status(401)
        .json({ error: "Not authorized, token verification failed" });
    }
  }

  // No token provided.
  return res
    .status(401)
    .json({ error: "Not authorized, no token provided" });
});

export { protect };

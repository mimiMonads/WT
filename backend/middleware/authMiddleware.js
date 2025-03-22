const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { User } = require("../models/models.js");
const { decode } = require("punycode");

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
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; // extract token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      
      req.user = await User.findById(decoded.id)
      if (!req.user) {
        return res
          .status(401)
          .json({ error: "Not authorized, user not found" });
      }
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

module.exports = { protect };


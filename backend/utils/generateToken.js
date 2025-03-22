const jwt = require("jsonwebtoken");

/**
 * Generate a JWT token using the user's ID as payload.
 * @param {string} userId 
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // or Whatever
  });
};

module.exports = generateToken;
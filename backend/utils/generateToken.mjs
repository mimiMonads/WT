import jwt from "jsonwebtoken";
const sign = jwt.sign

/**
 * Generate a JWT token using the user's ID as payload.
 * @param {string} userId 
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // or Whatever
  });
};

export default generateToken;
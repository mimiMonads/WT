import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.mjs";
import { Message, User } from "../models/models.mjs";
import { loginSchema, userSchema } from "../validators/validators.mjs";
import bcrypt from "bcrypt";

/**
 * @desc   Login interface
 * @route  POST /signup
 */
const loginForm = asyncHandler(async (req, res) => {
  // Show a login form or return JSON message
  res.send("Login interface (GET)");
});

const signup = asyncHandler(async (req, res) => {
  console.log(req.body);

  const { error, value } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const existing = await User.findOne({ name: value.name });
  if (existing) {
    return res.status(409).json({ error: "Username already taken" });
  }

 
  const password = await bcrypt.hash(value.password, 10);
  const newUser = await User.create({
    name: value.name,
    password,
    profilePicture: value.profilePicture,
    status: value.status,
    privacy: value.privacy,
  });

  const token = generateToken(newUser._id);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    _id: newUser._id,
    name: newUser.name,
    privacy: newUser.privacy,
    message: "Account created and logged in",
  });
});

/**
 * @desc   Login user & return JWT
 * @route  POST /login
 */
const loginUser = asyncHandler(async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, password } = req.body;

  const user = await User.findOne({ name});

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const token = generateToken(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    domain: ".tripleequal.dev",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({
    _id: user._id,
    name: user.name,
    privacy: user.privacy,
    message: "Logged in successfully",
  });
});

/**
 * @desc   "Logout" user
 * @route  GET /logout
 */
const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Logged out" });
});

/**
 * @desc   Get messages to display in /user
 * @route  POST /user/getM
 */
const getUserMessages = asyncHandler(async (req, res) => {
  // If we're using 'protect', then req.user should be set
  const userId = req.user._id; // or from the request body if you prefer
  const messages = await Message.find({ recipient: userId });
  res.status(200).json(messages);
});

/**
 * @desc   Delete (refuse) a message posted for a user
 * @route  POST /user/refuse
 */
const refuseMessage = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { messageId } = req.body;
  const message = await Message.findOne({ _id: messageId, recipient: userId });
  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }
  await message.deleteOne();
  res.json({ message: "Message refused/removed" });
});

/**
 * @desc   Replay a message
 * @route  POST /user/replay
 */
const replayMessage = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { messageId, replyContent } = req.body;

  const message = await Message.findOne({ _id: messageId, recipient: userId });
  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }

  message.replies.push({
    content: replyContent,
    date: new Date(),
  });
  await message.save();

  res.status(201).json({ message: "Reply added", data: message });
});

/**
 * @desc   Add a profile picture
 * @route  POST /user/php
 */
const addProfilePicture = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  // Typically you'd parse the uploaded file, store it, etc.
  // For example:
  // const user = await User.findById(userId);
  // user.profilePicture = "uploadedFilePath";
  // await user.save();

  res.status(201).json({ message: "Profile picture added" });
});

/**
 * @desc   Adds a status
 * @route  POST /user/status
 */
const addStatus = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { status } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  user.status = status;
  await user.save();

  res.json({ message: "Status updated", status: user.status });
});

/**
 * @desc   Allows the user to decide who can send them messages
 * @route  POST /user/privacy
 */
const setPrivacy = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { privacySetting } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  user.privacy = privacySetting;
  await user.save();

  res.json({ message: "Privacy updated", privacy: user.privacy });
});

/**
 * @desc   Add a message to the user (like a "wall post")
 * @route  POST /post/:userID
 */
const addMessageToUser = asyncHandler(async (req, res) => {
  const { userID } = req.params;
  const { content } = req.body;
  const senderId = req.user._id;

  const user = await User.findById(userID);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Optionally check user's privacy or relationship with req.user

  const newMessage = await Message.create({
    content,
    sender: senderId,
    recipient: user._id,
  });

  res.status(201).json(newMessage);
});

/**
 * @desc   Main page
 * @route  GET /
 */
const getMainPage = asyncHandler(async (req, res) => {
  res.send("Welcome to the main page!");
});

/**
 * @desc   User displayed user profile
 * @route  GET /user
 */
const getUserProfile = asyncHandler(async (req, res) => {
  let user
  
  try {
    user = await User.findById(req.user._id);
  } catch (e) {
    user = null;
  }

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

/**
 * @desc   User interface (by name)
 * @route  GET /user/:name
 *
 * This one might or might not require JWT.
 * It’s public read-only here, so we skip `protect`.
 */
const getUserInterface = asyncHandler(async (req, res) => {
  const userName = req.params.name;
  let user;
  try {
    user = await User.findOne({ name: userName }).select("-password");
  } catch {
    user = null;
  }
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

/**
 * @desc   About the project
 * @route  GET /about
 */
const aboutProject = (req, res) => {
  res.send("About the project...");
};

/**
 * @desc   Privacy page
 * @route  GET /privacy
 */
const privacyPage = (req, res) => {
  res.send("Privacy information...");
};

export {
  aboutProject,
  addMessageToUser,
  addProfilePicture,
  addStatus,
  getMainPage,
  getUserInterface,
  getUserMessages,
  getUserProfile,
  loginForm,
  loginUser,
  logoutUser,
  privacyPage,
  refuseMessage,
  replayMessage,
  setPrivacy,
  signup,
};

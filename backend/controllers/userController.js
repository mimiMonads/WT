const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const { User, Message } = require("../models/models");
const { loginSchema, messageSchema } = require("../validators/validators");

/**
 * @desc   Login interface
 * @route  GET /login
 */
const loginForm = asyncHandler(async (req, res) => {
  // Show a login form or return JSON message
  res.send("Login interface (GET)");
});

/**
 * @desc   Login user & return JWT
 * @route  POST /login
 */
const loginUser = asyncHandler(async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // NOTE: In a real app, you'd compare hashed passwords
  // For example: bcrypt.compare(password, user.passwordHash)
  if (user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // On success, generate a token:
  const token = generateToken(user._id);

  // Return token (and user data) to the client
  res.json({
    _id: user._id,
    name: user.name,
    username: user.username,
    token,
  });
});

/**
 * @desc   "Logout" user
 * @route  GET /logout
 */
const logoutUser = asyncHandler(async (req, res) => {
  // With JWT, there's no truly "server-side" logout if stateless
  // We can instruct the client to delete its stored token
  // or we can use a token blacklist in a real scenario.
  res.json({ message: "User logged out (client must discard token)" });
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

 
  try{
     user = await User.findById(req.user._id);
  } catch(e){
    user = null
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
  let user 
  try{
    user = await User.findOne({ name: userName }).select("-password"); 
  } catch {
    user = null
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

module.exports = {
  getMainPage,
  getUserProfile,
  getUserInterface,
  loginForm,
  loginUser,
  logoutUser,
  getUserMessages,
  refuseMessage,
  replayMessage,
  addProfilePicture,
  addStatus,
  setPrivacy,
  addMessageToUser,
  aboutProject,
  privacyPage,
};

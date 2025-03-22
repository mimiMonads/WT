const asyncHandler = require("express-async-handler");
const { Message } = require("../models/models");
const { messageSchema } = require("../validators/validators");

/**
 * @desc    Get all Messages
 * @route   GET /api/messages
 * @access  Public
 */
const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find();
  res.status(200).json(messages);
});

/**
 * @desc    Create New Message
 * @route   POST /api/messages
 * @access  Public
 */
const createMessage = asyncHandler(async (req, res) => {
  

  // Validate request body using your validator
  const { error } = messageSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Destructure data from the request
  const { content, sender, recipient } = req.body;

  // Create the message in Mongo
  const newMessage = await Message.create({ content, sender, recipient });
  res.status(201).json(newMessage);
});

/**
 * @desc    Get Single Message
 * @route   GET /api/messages/:id
 * @access  Public
 */
const getMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }
  res.status(200).json(message);
});

/**
 * @desc    Update Message
 * @route   PUT /api/messages/:id
 * @access  Public
 */
const updateMessage = asyncHandler(async (req, res) => {
  let message = await Message.findById(req.params.id);
  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }

  // Validate new data
  const { error } = messageSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { content, sender, recipient } = req.body;

  // Update and save
  message.content = content;
  message.sender = sender;
  message.recipient = recipient;
  await message.save();

  res.status(200).json(message);
});

/**
 * @desc    Delete Message
 * @route   DELETE /api/messages/:id
 * @access  Public
 */
const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }
  await message.deleteOne();
  res.status(200).json({ message: "Message deleted" });
});

/**
 * @desc    Search Messages
 * @route   GET /api/messages/search/:query
 * @access  Public
 */
const searchMessages = asyncHandler(async (req, res) => {
  const q = req.params.query;
  // Basic search over content
  const messages = await Message.find({
    content: { $regex: q, $options: "i" },
  });
  res.status(200).json(messages);
});

module.exports = {
  getMessages,
  createMessage,
  getMessage,
  updateMessage,
  deleteMessage,
  searchMessages,
};

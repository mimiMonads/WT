const asyncHandler = require('express-async-handler');

//@desc Get all Messages
//@route GET /api/messages
//@access Public
const getMessages = async (req, res) => {
    res.status(200).json({message: "Get all messages"})};

//@desc Create New Message
//@route POST /api/messages
//@access Public
const createMessage = asyncHandler(async (req, res) => {
    console.log("Request body is:", req.body);
    const {content, sender} = req.body;
    if(!content || !sender){
        return res.status(400).json({error: "Content and Sender are required"});
    }
    res.status(201).json({message: "Create message"})});

//@desc Get Single Message
//@route GET /api/messages/:id
//@access Public
const getMessage = asyncHandler(async (req, res) => {
    res.status(200).json({message: `Get message for ${req.params.id}`})});

//@desc Update Message
//@route PUT /api/messages/:id
//@access Public
const updateMessage = asyncHandler(async(req, res) => {
    res.status(200).json({message: `Update message for ${req.params.id}`})});

//@desc Delete Message
//@route DELETE /api/messages/:id
//@access Public
const deleteMessage = asyncHandler(async(req, res) => {
    res.status(200).json({message: `Delete message for ${req.params.id}`})});

//@desc Search Messages
//@route GET /api/messages/search/:query
//@access Public
const searchMessages = asyncHandler(async(req, res) => {
    res.status(200).json({message: `Search messages for query: ${req.params.query}`})});

module.exports = {getMessages, createMessage, getMessage, updateMessage, deleteMessage, searchMessages};
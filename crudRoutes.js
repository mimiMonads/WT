const express = require('express');
const router = express.Router();
const {getMessages, createMessage, getMessage, updateMessage, deleteMessage, searchMessages} = require("../controllers/messageController");

router.route("/").get(getMessages).post(createMessage);
router.route("/:id").get(getMessage).put(updateMessage).delete(deleteMessage);
router.route("/search/:query").get(searchMessages);

module.exports = router;

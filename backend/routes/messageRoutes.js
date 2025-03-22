const express = require("express");
const router = express.Router();
const {
  getMessages,
  createMessage,
  getMessage,
  updateMessage,
  deleteMessage,
  searchMessages,
} = require("../controllers/messageController");

// /api/messages
router.route("/")
  .get(getMessages)
  .post(createMessage);

// /api/messages/search/:query
router.get("/search/:query", searchMessages);

// /api/messages/:id
router
  .route("/:id")
  .get(getMessage)
  .put(updateMessage)
  .delete(deleteMessage);

module.exports = router;

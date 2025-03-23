import { Router } from "express";
const router = Router();
import { getMessages, createMessage, getMessage, updateMessage, deleteMessage, searchMessages } from "../controllers/messageController.mjs";

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

export default router;

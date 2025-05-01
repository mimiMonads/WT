import { Router } from "express";
const router = Router();
import {
  createMessage,
  deleteMessage,
  getMessage,
  getMessages,
  searchMessages,
  updateMessage,
} from "../controllers/messageController.mjs";

// /api/messages
router.route("/")
  .post(createMessage);

router.route("/of/:user")
  .get(getMessages);

// /api/messages/search/:query
router.get("/search/:query", searchMessages);

// /api/messages/:id
router
  .route("/:id")
  .get(getMessage)
  .put(updateMessage)
  .delete(deleteMessage);

export default router;

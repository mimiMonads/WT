// routes/userRoutes.js
import { Router } from "express";
const router = Router();
import { protect } from "../middleware/authMiddleware.mjs";
import { getMainPage, getUserProfile, getUserInterface, loginForm, loginUser, logoutUser, getUserMessages, refuseMessage, replayMessage, addProfilePicture, addStatus, setPrivacy, addMessageToUser, aboutProject, privacyPage } from "../controllers/userController.mjs";

// Public routes
router.get("/", getMainPage);
router.get("/login", loginForm);
router.post("/login", loginUser);
router.get("/logout", logoutUser); // Could be public or protected
router.get("/about", aboutProject);
router.get("/privacy", privacyPage);

// This one we decided is public read-only:
router.get("/user/:name", getUserInterface);

// Protected routes
router.get("/user", protect, getUserProfile);
router.post("/user/getM", protect, getUserMessages);
router.post("/user/refuse", protect, refuseMessage);
router.post("/user/replay", protect, replayMessage);
router.post("/user/php", protect, addProfilePicture);
router.post("/user/status", protect, addStatus);
router.post("/user/privacy", protect, setPrivacy);
router.post("/post/:userID", protect, addMessageToUser);

export default router;

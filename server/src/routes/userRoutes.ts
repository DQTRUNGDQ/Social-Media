import express from "express";
import { getProfile, updateUserProfile } from "~/controllers/userController";
import authMiddleware from "~/middlewares/auth";

const router = express.Router();

// Route lấy thông tin người dùng hiện tại
router.get("/profile", authMiddleware, getProfile);
router.put("/update-profile", authMiddleware, updateUserProfile);

export default router;

import express from "express";
import upload from "~/middlewares/uploadMiddleware";
import {
  createThread,
  getThread,
  toggleLike,
} from "~/controllers/threadController";
import authMiddleware from "~/middlewares/auth";

const router = express.Router();

router.post("/upload", upload.single("media"), authMiddleware, createThread);
router.get("/posts", authMiddleware, getThread);
router.post("/like", authMiddleware, toggleLike);

export default router;

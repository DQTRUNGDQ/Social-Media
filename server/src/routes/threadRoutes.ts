import express from "express";
import upload from "~/middlewares/uploadMiddleware";
import { createThread } from "~/controllers/threadController";
import authMiddleware from "~/middlewares/auth";

const router = express.Router();

router.post("/upload", upload.single("media"), authMiddleware, createThread);

export default router;

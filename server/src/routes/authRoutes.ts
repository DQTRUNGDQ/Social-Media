import express from "express";
import { register, login, logout } from "../controllers/authController";
import {
  validateRegister,
  validateLogin,
  validateRefreshToken,
} from "../middlewares/validation";

const router = express.Router();

// Route đăng ký
router.post("/register", validateRegister, register);

// Route đăng nhập
router.post("/login", validateLogin, login);

// Route logout
router.post("/logout", validateRefreshToken, logout);

export default router;

import express from "express";
import { register, login, logout } from "../controllers/authController";
import { validateRegister, validateLogin } from "../middlewares/validation";

const router = express.Router();

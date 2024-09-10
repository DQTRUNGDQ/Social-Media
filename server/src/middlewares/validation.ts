import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

// Validator cho đăng ký
export const validateRegister = [
  check("name").notEmpty().withMessage("Name is required"),
];
check("email").isEmail().withMessage("Email is invalid"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };

// Validator cho đăng nhập
export const validateLogin = [
  check("email").isEmail().withMessage("Email is invalid"),
  check("password").notEmpty().withMessage("password is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validator cho refresh token và logout
export const validateRefreshToken = [
  check("refreshToken").notEmpty().withMessage("Refresh Token is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

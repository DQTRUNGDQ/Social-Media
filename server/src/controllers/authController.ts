import { Request, Response } from "express";
import * as authService from "../services/authService";
import { USERS_MESSAGES } from "../constants/message";
import User from "~/models/User";
import { sendResetCodeEmail } from "~/services/emailService";
import { generateResetCode, verifyResetCode } from "../services/tokenService";
import bcrypt from "bcrypt";

// Controller đăng ký
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user, tokens } = await authService.registerUser(req.body);
    res.status(201).send({
      message: USERS_MESSAGES.REGISTER_SUCCESS,
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
};

// Controller đăng nhập
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { tokens } = await authService.loginUser(email, password);
    res.send({
      result: {
        message: USERS_MESSAGES.LOGIN_SUCCESS,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
};

// Controller đăng xuất
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new Error("Refresh token is required");
    }
    await authService.logoutUser(refreshToken);
    res.send({ message: USERS_MESSAGES.LOGOUT_SUCCESS });
  } catch (error: any) {
    res.status(401).send({ error: error.message });
  }
};

// Controller quên mật khẩu
export const requestPasswordReset = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email } = req.body;

  try {
    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: USERS_MESSAGES.USER_NOT_FOUND });
    }

    // Tạo mã xác thực và gửi email
    const resetCode = generateResetCode(user.id.toString());
    await sendResetCodeEmail(email, resetCode);

    return res.status(200).send({ message: "Password reset code sent" });
  } catch (error: any) {
    return res.status(500).send({ error: error.message });
  }
};

// Controller xác thực mã code reset

export const VerifyResetCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, resetCode } = req.body;

  try {
    // Xác thực mã và lưu trạng thái xác thực
    const isValid = verifyResetCode(userId, resetCode);
    if (!isValid) {
      res.status(400).send({ message: "Invalid or expired reset code" });
    }

    res.status(200).send({
      message: "Reset code verified, you can now reset your password",
    });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

// Controller reset password

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, newPassword } = req.body;

  try {
    // Tìm người dùng theo userId
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send({ message: USERS_MESSAGES.USER_NOT_FOUND });
      return;
    }

    // Băm mật khẩu mới và cập nhật
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).send({ message: "PASSWORD UPDATED SUCCESSFULLY" });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

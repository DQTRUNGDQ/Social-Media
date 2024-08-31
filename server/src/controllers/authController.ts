import { Request, Response } from "express";
import User from "~/models/User";
import jwt from "jsonwebtoken";
import { USERS_MESSAGES } from "~/constants/message";
import { config } from "dotenv";
config();

// Controller đăng ký
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = new User(req.body);
    await user.save();

    const { accessToken, refreshToken } = await user.generateAuthTokens();

    res.json({
      message: USERS_MESSAGES.REGISTER_SUCCESS,
    });
    res.status(201).send({ user, accessToken, refreshToken });
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
};

// Controller đăng nhập
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);

    const { accessToken, refreshToken } = await user.generateAuthTokens();
    res.send({ user, accessToken, refreshToken });
    res.json({
      message: USERS_MESSAGES.LOGIN_SUCCESS,
    });
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
};

// Controller logout

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new Error(USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED);
    }

    // Xác thực Refresh Token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET as string
    ) as { _id: string };

    // Tìm người dùng và xóa Refresh Token
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": refreshToken,
    });

    if (!user) {
      throw new Error(USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID);
    }
    await user.removeRefreshToken(refreshToken);

    res.send({ message: USERS_MESSAGES.LOGOUT_SUCCESS });
  } catch (error: any) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

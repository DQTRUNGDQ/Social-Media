import { RefreshToken } from "./../models/RefreshToken";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Đăng ký người dùng mới
export const registerUser = async (userData: any): Promise<{ user: any }> => {
  const user = new User(userData);
  await user.save();
  // Xóa trường không mong muốn hiển thị khỏi đối tượng người dùng trước khi trả về
  const { followers, following, posts, ...userWithoutFields } = user.toObject();
  return { user: userWithoutFields };
};

// Đăng nhập người dùng
export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: any; tokens: IAuthTokens }> => {
  const user = await User.findByCredentials(email, password);
  const tokens = await user.generateAuthTokens();

  return { user, tokens };
};

// Đăng xuất người dùng
export const logoutUser = async (refreshToken: string): Promise<void> => {
  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET as string
  ) as { id: string };
  console.log("Decoded token:", decoded);
  const user = await User.findOne({
    _id: decoded.id,
    RefreshToken: RefreshToken,
  });

  if (!user) {
    throw new Error("Invalid refresh token");
  }

  // Tăng tokenVersion để vô hiệu hóa tất cả các accessToken cũ
  await user.invalidateTokens();
};

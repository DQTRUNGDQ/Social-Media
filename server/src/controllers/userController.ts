import { Request, Response, NextFunction } from "express";
import User, { IUser } from "~/models/User";
import asyncHandler from "~/middlewares/asyncHandler";
import { AppError } from "~/utils/AppError";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const getProfile = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      res.json({ user });
    } catch (error: any) {
      res.status(500).send({ error: "Server error" });
    }
  }
);

export const updateUserProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { bio, link, avatar } = req.body;

    try {
      const user: IUser | null = await User.findById(req.user.id);

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      // Kiểm tra lại bio trước khi lưu
      if (bio !== undefined && bio.length > 200) {
        return next(new AppError("Bio cannot exceed 200 characters", 400));
      }

      if (bio !== undefined) user.bio = bio;
      if (link !== undefined) user.link = link;
      if (avatar !== undefined) user.avatar = avatar;

      await user.save();

      res.status(200).json({
        message: "Profile updated successfully",
        user,
      });
    } catch (error: any) {
      if (error.name === "ValidationError") {
        return next(new AppError(error.message, 400));
      }
      res.status(500).json({ error: "Server error" });
    }
  }
);

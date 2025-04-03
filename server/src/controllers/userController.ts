import { Request, Response, NextFunction } from "express";
import User, { IUser } from "~/models/User";
import asyncHandler from "~/middlewares/asyncHandler";
import { AppError } from "~/utils/AppError";
import { v4 as uuidv4 } from "uuid";
import { bucket } from "~/config/firebaseConfig";
import { error } from "console";
import { blob } from "node:stream/consumers";

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
    const { bio, link } = req.body;
    const file = req.file;
    console.log("Received file:", file); // Thêm dòng này để kiểm tra

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

      if (file) {
        const fileName = `Avatar/${uuidv4()}-${file.originalname}`;
        const fileUpload = bucket.file(fileName);

        const blobStream = fileUpload.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });

        blobStream.on("error", (error) => {
          console.error("Error uploading to Firebase:", error);
          return next(new AppError("Failed to upload avatar", 500));
        });

        blobStream.on("finish", async () => {
          await fileUpload.makePublic();
          const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${
            bucket.name
          }/o/${encodeURIComponent(fileName)}?alt=media`;

          // Xoá avatar cũ trên Firebase nếu có
          if (user.avatar) {
            const oldFileName = user.avatar
              .split("/o/")[1]
              ?.split("?alt=media")[0];
            if (oldFileName) {
              await bucket
                .file(decodeURIComponent(oldFileName))
                .delete()
                .catch(() => {});
            }
          }

          // Cật nhật avatar mới
          user.avatar = fileUrl;
          await user.save();

          return res.status(200).json({
            message: "Profile updated successfully",
            avatar: user.avatar,
            user,
          });
        });

        blobStream.end(file.buffer);
      } else {
        // Nếu không có file mới, chỉ cập nhật thông tin khác
        await user.save();
        res.status(200).json({
          message: "Profile updated successfully",
          user,
        });
      }
    } catch (error: any) {
      if (error.name === "ValidationError") {
        return next(new AppError(error.message, 400));
      }
      res.status(500).json({ error: "Server error" });
    }
  }
);

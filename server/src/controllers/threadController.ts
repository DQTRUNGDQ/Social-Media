import { NextFunction, Request, Response } from "express";
import Thread from "~/models/Thread";
import User, { IUser } from "~/models/User";
import { AuthenticatedRequest } from "../middlewares/auth";
import { processPostContent } from "~/services/threadService";
import { bucket } from "~/config/firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import Hashtag from "~/models/Hashtag";
import asyncHandler from "~/middlewares/asyncHandler";
import { error } from "console";
import { AppError } from "~/utils/AppError";
import Like from "~/models/Like";

const createThread = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { content } = req.body;
  const { textContent, hashtags } = processPostContent(content);

  // Lấy các tệp để upload lên Firebase
  const file = req.file;
  if (!file) {
    return res.status(400).send("Không có file được tải lên");
  }
  // const fileName = `${uuidv4()}-${file.originalname}`;
  const fileName = file.originalname;
  const fileUpload = bucket.file(fileName);

  // Tạo luồng ghi để tải tệp lên
  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  blobStream.on("error", (error) => {
    return res.status(500).json({ message: "Lỗi khi upload file", error });
  });

  blobStream.on("finish", async () => {
    await fileUpload.makePublic();

    const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURIComponent(fileName)}?alt=media`;

    // Tạo đối tượng Thread mới
    const newThread = {
      content: textContent,
      hashtags,
      images: file.mimetype.includes("image") ? [fileUrl] : [],
      videos: file.mimetype.includes("video") ? [fileUrl] : [],
      mediaUrl: fileUrl,
      mediaType: file.mimetype.includes("image") ? "image" : "video",
      author: req.user,
      createdAt: new Date(),
    };

    // console.log("User:", req.user);

    try {
      const post = await Thread.create(newThread); // Lưu thông tin post vào cơ sở dữ liệu
      // Cập nhật hashtags
      for (const hashtag of hashtags) {
        let existingHashtag = await Hashtag.findOne({ name: hashtag });

        if (!existingHashtag) {
          // Nếu hashtag chưa tồn tại, tạo mới
          existingHashtag = new Hashtag({ name: hashtag });
        }

        // Cập nhật số lần sử dụng và thêm threadId vào mảng threads
        existingHashtag.usageCount += 1; // Tăng usageCount
        if (!existingHashtag.threadsId.includes(post.id)) {
          existingHashtag.threadsId.push(post.id); // Thêm threadId
        }

        await existingHashtag.save(); // Lưu lại
      }
      return res.status(200).json({ message: "Bài viết đã được tạo!", post });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi khi tạo bài viết", error });
    }
  });

  blobStream.end(file.buffer);

  return new Promise((relsove) => {
    blobStream.on("finish", () => relsove(res));
  });
};

const getThread = asyncHandler(
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
      const posts = await Thread.find()
        .populate("author", "username")
        .sort({ createdAt: -1 });
      // Lấy danh sách bài viết người dùng đã like
      const likedPosts = await Like.find({ user: req.user.id }).distinct(
        "threadId"
      );
      const likedPostIds = likedPosts.map((id) => id.toString());
      // Thêm trạng thái 'isLiked' cho mỗi bài viết
      const formattedPosts = posts.map((post) => ({
        ...post.toObject(),
        isLiked:
          likedPostIds.length > 0
            ? likedPostIds.includes(post._id.toString())
            : false, // Gắn trạng thái like cho bài viết
      }));

      res.json({ posts: formattedPosts });
    } catch {
      console.error(error);
      res.status(500).json({ message: "Error fetching posts" });
    }
  }
);

const toggleLike = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { threadId } = req.body;
      const userId = req.user.id;
      const thread = await Thread.findById(threadId);
      if (!thread) {
        res
          .status(404)
          .json({ message: "Thread no longer exists or has been deleted" });
        return;
      }

      const user = await User.findById(userId, "username");
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Kiểm tra xem người dùng đã có username chưa
      let username = user.username;

      if (!username) {
        // Nếu chưa có username, tạo username ngẫu nhiên
        username = generateRandomUsername();
      }

      const existingLike = await Like.findOne({ threadId, user: userId });

      if (existingLike) {
        // Nếu đã like thì thực hiện unlike (xóa like)
        await Like.deleteOne({ _id: existingLike._id });
        if (thread.likesCount > 0) {
          thread.likesCount--;
        }
        await thread.save();
        res.status(200).json({
          isLiked: false,
          likesCount: thread.likesCount,
        });
      } else {
        const newLike = new Like({
          threadId,
          user: userId,
          username,
          createdAt: new Date(),
        });
        await newLike.save();
        thread.likesCount++;
        await thread.save();
        res.status(200).json({
          isLiked: true,
          likesCount: thread.likesCount,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

const getLikedThreads = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user.id;

    // Tìm tất cả những bài viết mà người dùng đã like
    const likedThreads = await Like.find({ user: userId }).populate("threadId");

    if (!likedThreads || likedThreads.length === 0) {
      res.status(404).json([]);
    }

    const likedThreadData = likedThreads.map((like) => like.threadId);

    res.status(200).json(likedThreadData);
  }
);

function generateRandomUsername(): string {
  const words = [
    "cool",
    "super",
    "great",
    "happy",
    "awesome",
    "smart",
    "bright",
    "shiny",
    "star",
    "moon",
    "sky",
    "quick",
    "fast",
    "sun",
    "fire",
    "wave",
    "cloud",
  ];

  const randomWord = words[Math.floor(Math.random() * words.length)];
  const randomNum = Math.floor(Math.random() * 1000);

  // Tạo username có dạng: "cool123" với độ dài khoảng 15 ký tự
  return `@${randomWord}${randomNum}`;
}

export { getThread, createThread, toggleLike, getLikedThreads };

import { Request, Response } from "express";
import Thread from "~/models/Thread";
import { AuthenticatedRequest } from "../middlewares/auth";
import { processPostContent } from "~/services/threadService";
import { bucket } from "~/config/firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import Hashtag from "~/models/Hashtag";

const createThread = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { content } = req.body;
  const { textContent, hashtags } = processPostContent(content);

  // Lấy các tệp để upload lên Firebase
  const file = req.file as any;
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

    console.log("User:", req.user);

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

export { createThread };

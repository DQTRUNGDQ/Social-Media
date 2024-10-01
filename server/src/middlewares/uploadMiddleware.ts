import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

// Kiểm tra định dạng file ảnh và video
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const fileTypes = /jpeg|jpg|png|mp4|mov|avi/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Chỉ cho phép các định dạng ảnh hoặc video hợp lệ"));
  }
};

//Tạo instance của multer
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: { fileSize: 40 * 1024 * 1024 },
});

export default upload;

import { Request, Response, NextFunction } from "express";
import { AppError } from "~/utils/AppError";
import logger from "~/utils/logger";
import config from "~/config";

export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const isOperational = err instanceof AppError && err.isOperational;

  // Log lỗi theo mức độ chi tiết dựa trên môi trường
  if (config.app.debug || !isOperational) {
    logger.error(`Error: ${err.message} \nStack: ${err.stack}`);
  } else {
    logger.error(`Operational Error: ${err.message}`);
  }

  res.status(statusCode).json({
    status: isOperational ? "fail" : "error",
    message: isOperational ? err.message : "Something went wrong!",
  });
};

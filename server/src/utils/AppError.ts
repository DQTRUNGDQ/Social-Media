export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Đánh dấu lỗi thuộc về hệ thống hoặc lập trình

    Error.captureStackTrace(this, this.constructor);
  }
}

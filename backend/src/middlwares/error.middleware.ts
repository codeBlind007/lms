import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import AppError from "../utils/AppError.js";

const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;

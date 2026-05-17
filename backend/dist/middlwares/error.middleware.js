import express, {} from "express";
import AppError from "../utils/AppError.js";
const errorMiddleware = (err, req, res, next) => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message,
    });
};
export default errorMiddleware;
//# sourceMappingURL=error.middleware.js.map
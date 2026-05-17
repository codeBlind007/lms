import { type NextFunction, type Request, type Response } from "express";
import AppError from "../utils/AppError.js";
declare const errorMiddleware: (err: Error | AppError, req: Request, res: Response, next: NextFunction) => void;
export default errorMiddleware;
//# sourceMappingURL=error.middleware.d.ts.map
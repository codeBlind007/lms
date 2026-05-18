import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies?.token ||
            req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return next(new AppError("Unauthorized", 401));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return next(new AppError("Invalid or expired token", 401));
    }
};
export default authMiddleware;
//# sourceMappingURL=auth.middleware.js.map
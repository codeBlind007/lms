import type { Request, Response, NextFunction } from "express";
interface JwtPayload {
    id: string;
    email: string;
    role: 'admin' | 'sales';
}
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export default authMiddleware;
//# sourceMappingURL=auth.middleware.d.ts.map
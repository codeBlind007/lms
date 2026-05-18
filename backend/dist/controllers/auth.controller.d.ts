import type { NextFunction, Request, Response } from "express";
declare const authController: {
    signup: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    me: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    logout: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
};
export default authController;
//# sourceMappingURL=auth.controller.d.ts.map
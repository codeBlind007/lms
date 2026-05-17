import type { NextFunction, Request, Response } from 'express';
declare const authController: {
    signup: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
export default authController;
//# sourceMappingURL=auth.controller.d.ts.map
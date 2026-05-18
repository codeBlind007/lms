import type { Response, Request, NextFunction } from "express";
declare const leadController: {
    createLead: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLeads: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    getSingleLead: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    deleteLead: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    updateLead: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
};
export default leadController;
//# sourceMappingURL=lead.controller.d.ts.map
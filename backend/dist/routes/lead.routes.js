import express from "express";
import leadController from "../controllers/lead.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();
router
    .get("/", authMiddleware, leadController.getLeads)
    .post("/", authMiddleware, leadController.createLead);
router
    .get("/:id", authMiddleware, leadController.getSingleLead)
    .delete("/:id", authMiddleware, leadController.deleteLead)
    .patch("/:id", authMiddleware, leadController.updateLead);
export default router;
//# sourceMappingURL=lead.routes.js.map
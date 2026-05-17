import express from "express";
import authController from "../controllers/auth.controller.js";

const router = express.Router();
console.log("Hello");
router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.get("/me", authController.me);
router.post("/logout", authController.logout);

export default router;

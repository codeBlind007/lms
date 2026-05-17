import express from 'express';
import authController from '../controllers/auth.controller.js';
const authRouter = express.Router();
authRouter.post('/login', authController.login);
authRouter.post('/signup', authController.signup);
export default authRouter;
//# sourceMappingURL=auth.router.js.map
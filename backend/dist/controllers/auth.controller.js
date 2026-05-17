import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import AppError from '../utils/AppError.js';
import Users from '../models/user.model.js';
const signup = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return next(new AppError("All fields are required", 400));
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Users.create({
            fullName,
            email,
            password: hashedPassword
        });
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error) {
        next(error);
    }
};
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new AppError("All fields are required", 400));
        }
        const user = await Users.findOne({ email: email });
        if (!user) {
            return next(new AppError("Invalid Credentials", 400));
        }
        const hashedPassword = user.password;
        const isCorrect = await bcrypt.compare(password, hashedPassword);
        if (!isCorrect) {
            return next(new AppError("Invalid Credentials", 400));
        }
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
        });
        res.status(200).json({
            success: true,
            message: "Login successful",
        });
    }
    catch (error) {
        return next(new AppError("Login failed. Please try again.", 500));
    }
};
const authController = {
    signup,
    login
};
export default authController;
//# sourceMappingURL=auth.controller.js.map
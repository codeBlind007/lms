import jwt, { type JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError.js";
import UsersAssignment from "../models/user.model.js";

type AuthTokenPayload = JwtPayload & {
  id: string;
  email: string;
  role: string;
};

const isProduction = process.env.NODE_ENV === "production";

const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
};

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullName, email, password } = req.body;
    const role = "sales";
    if (!fullName || !email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    const userExist = await UsersAssignment.findOne({ email: email });
    if (userExist) {
      new AppError("User already exist with this email", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UsersAssignment.create({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User registration successful",
      user: {
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    const user = await UsersAssignment.findOne({ email: email });
    if (!user) {
      return next(new AppError("Invalid Credentials", 400));
    }

    const hashedPassword = user.password;
    const isCorrect = await bcrypt.compare(password, hashedPassword);

    if (!isCorrect) {
      return next(new AppError("Invalid Credentials", 400));
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" },
    );

    res.cookie("token", token, authCookieOptions);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    return next(new AppError("Login failed. Please try again.", 500));
  }
};

const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(200).json({ success: true, user: null });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    ) as AuthTokenPayload;
    const user = await UsersAssignment.findById(decoded.id).select(
      "fullName email role",
    );
    if (!user) return res.status(200).json({ success: true, user: null });

    return res.status(200).json({
      success: true,
      user: { fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (error) {
    return next(new AppError("Unable to authenticate user", 401));
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("token", authCookieOptions);
    return res.status(200).json({ success: true, message: "Logged out" });
  } catch (error) {
    return next(new AppError("Logout failed", 500));
  }
};

const authController = {
  signup,
  login,
  me,
  logout,
};

export default authController;

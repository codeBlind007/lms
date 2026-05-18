import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import { connectDB } from "./config/db.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import authRouter from './routes/auth.routes.js'
import leadRouter from './routes/lead.routes.js'
import cors from 'cors';

console.log("authRouter import:", typeof authRouter);
dotenv.config();
connectDB();
const app = express();

const PORT = process.env.PORT;
const isProduction = (process.env.NODE_ENV === "production");
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", (req, res, next) => {
  console.log("Auth route hit");
  next();
}, authRouter);

app.use("/api/leads", (req, res, next) => {
  console.log("lead route hit");
  next();
}, leadRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello from the server",
  });
});


app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

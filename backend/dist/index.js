import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import errorMiddleware from './middlwares/error.middleware.js';
import authRouter from './routes/auth.router.js';
dotenv.config();
connectDB();
const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Hello from the server"
    });
});
app.use(errorMiddleware);
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map
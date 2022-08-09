import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authrouter from './routes/auth.js';
import postsRouter from "./routes/posts.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

dotenv.config();

const app = express()

app.use(cors({credentials: true, origin: 'http://localhost:3000'}, "*"))
app.use("/api/storage", express.static("storage"))
app.use(express.json({limit: '0.151mb'}));
app.use(express.urlencoded({limit: '0.151mb', extended: true}));
app.use(cookieParser())
app.use("/api/posts", postsRouter)
app.use("/api", authrouter)
mongoose.connect(process.env.MONGODB_URI)

app.get('*', (req, res) => {
    res.sendFile(path.resolve(path.resolve(), 'frontend', 'build', 'index.html'));
});

app.listen(process.env.PORT || 8000, "0.0.0.0", () => {
    console.log("Server is running.")
})
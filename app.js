import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authrouter from './routes/auth.js';
import postsRouter from "./routes/posts.js";
import commentsRouter from './routes/comments.js';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

dotenv.config();

const app = express()

app.use(cors({credentials: true, origin: 'http://localhost:3000'}, "*"))
app.use("/storage", express.static("storage"))
app.use(express.json({limit: '0.151mb'}));
app.use(express.urlencoded({limit: '0.151mb', extended: true}));
app.use(cookieParser())
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/", authrouter)
mongoose.connect(process.env.MONGODB_URI)

app.use(express.static('frontend/build'));

if (process.env.NODE_ENV == "production"){
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('frontend', 'build', 'index.html'));
  })
}

app.listen(process.env.PORT || 8000, "0.0.0.0", () => {
    console.log("Server is running.")
})
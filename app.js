import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authrouter from './routes/auth.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express()
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))
app.use(cookieParser())
app.use(authrouter)
mongoose.connect(process.env.MONGODB_URI)

app.get("/", (req, res) => {
    res.send("hello world")
})

app.listen(8000, () => {
    console.log("Server is running.")
})
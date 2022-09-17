import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authrouter from './routes/auth.js';
import postsRouter from "./routes/posts.js";
import commentsRouter from './routes/comments.js';
import StorageRouter from './routes/storage.js';
import DatabaseDeveloperRouter from "./routes/DatabaseDeveloperRouter.js";
import cookieParser from 'cookie-parser';
import bodyParser from "body-parser";
import cors from 'cors';
import path from 'path';
dotenv.config();
const app = express();
const urlEncodedParser = bodyParser.urlencoded({ limit: '1.151mb', extended: true });
app.use(urlEncodedParser);
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use("/storage", express.static("storage"));
app.use(express.json({ limit: '1.551mb' }));
app.use(express.urlencoded({ limit: '1.151mb', extended: true }));
app.use(cookieParser());
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/storage/UserCreatedContent", StorageRouter);
app.use("/", authrouter);
await mongoose.connect(process.env.MONGODB_URI);
app.use(express.static('frontend/build'));
if (process.env.NODE_ENV == "production") {
    app.get('*', (req, res) => {
        res.sendFile(path.resolve('frontend', 'build', 'index.html'));
    });
}
else {
    app.use("/db", DatabaseDeveloperRouter);
}
app.listen(parseInt(process.env.PORT) || 8000, "0.0.0.0", () => {
    console.log("Server is running.");
});
//Hello World!

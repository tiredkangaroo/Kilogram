import express from 'express';
import mongoose from 'mongoose';
import bodyParser from "body-parser";

import { ProtectedRoute } from "../utils/loginRequired.js";
import Post from '../models/Post.js';
import { Validations } from '../utils/validations.js';
import { RequestInterface } from '../utils/RequestResponseInterfaces.js';

const commentsRouter = express.Router();

const urlEncodedParser = bodyParser.urlencoded({ extended: true })
const ObjectId = mongoose.Types.ObjectId
const Validate = new Validations();
class Routes {
  async post(req: RequestInterface, res: express.Response){
    const postID = "62fafd8a14c43493335bebdd";
    const post = await Post.findOne({_id: new ObjectId(postID)})
    if (!post) { return res.status(404) }
    return res.json(post.comments)
  }
  async new_comment(req: RequestInterface, res: express.Response) {
    const username = req.user!.username;
    const userID = req.user!._id;
    const text = req.body.text;
    const post = req.post;
    post!.comments.push({username: username, userID: userID, text: text, date: new Date()});
    await Post.updateOne({_id: post!._id}, {comments: post!.comments});
    return res.json(post);
  }
}
const Router = new Routes();
// commentsRouter.get("/all", async(req, res) => {ProtectedRoute(req, res, Router.all)})
commentsRouter.post("/new", urlEncodedParser, async (req, res) => {ProtectedRoute(req, res, Router.new_comment, ["text", "postID"], [Validate.post])})
export default commentsRouter;
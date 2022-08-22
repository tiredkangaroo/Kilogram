import express from 'express';
import mongoose from 'mongoose';
import bodyParser from "body-parser";

import { ProtectedRoute } from "../utils/loginRequired.js";
import Post from '../models/Post.js';

const commentsRouter = express.Router();

const urlEncodedParser = bodyParser.urlencoded({ extended: true })
const ObjectId = mongoose.Types.ObjectId

class Routes {
  async post(req, res){
    const postID = "62fafd8a14c43493335bebdd";
    const post = await Post.findOne({_id: ObjectId(postID)})
    if (!post) { return res.status(404) }
    return res.json(post.comments)
  }
  new_comment(req, res) {
    return res.json(req.user);
  }
}
const Router = new Routes();
commentsRouter.get("/all", async(req, res) => {ProtectedRoute(req, res, Router.all)})
commentsRouter.post("/new", urlEncodedParser, async (req, res) => {ProtectedRoute(req, res, Router.new_comment)})
export default commentsRouter;
import express from 'express';
import Post from "../models/Post.js";
import { Route } from "../utils/route.js";
import { noAuthMessage, ProtectedRoute } from "../utils/loginRequired.js";
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import multer from 'multer';
import crypto from "crypto";
import { unlink } from "fs";

const urlEncodedParser = bodyParser.urlencoded({ extended: true })
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null,'storage/');
  },
  filename : (req,file,cb) => {
      file.newName = crypto.randomBytes(32).toString("hex") + "." + FILE_TYPE_MAP[file.mimetype]
      cb(null, file.newName)
  }
})
Array.prototype.reversed = function (){
  let newArray = [];
  for (let i = this.length - 1; i >= 0; i--){
    newArray.push(this[i])
  }
  return newArray;
}
const upload = multer({ storage:storage })
const ObjectId = mongoose.Types.ObjectId

class Routes {
  async newPost(req, res){
    let text = req.body.text;
    if (text.length > 150304) {
        return res.status(400).send("Limit for the post is 150,304 characters.")
    }
    const author = req.user
    const authorID = author._id;
    const current_date = new Date();
    const likerIDs = []
    const comments = []
    const newPost = new Post({
        authorUsername: author.username, 
        authorID: authorID, 
        date_created: current_date, 
        likerIDs: likerIDs, 
        comments: comments,
        text: text,
        imageKey: req.file.newName
    });
    await newPost.save()
    return res.status(200).json(newPost._id)
  }
  async all(req, res) {
    const result = await Post.find({})
    return res.json(result.reversed())
  }
  async post(req, res){
    const postID = req.query.id
    let post; //const is scope-specific, attempting to create a const in the try statement does not allow further use beyond
    //the scope
    if (!postID){ return res.status(400).send("The ID is a required parameter.") }
    try{
        post = await Post.findOne({_id: postID})
    }
    catch{
        return res.status(400).send("The ID is invalid.")
    }
    if (!post) { return res.status(404).send("Post with ID does not exist.") }
    return res.json(post)
  }
  async delete(req, res){
    const postID = req.body.postID;
    if (!postID) { return res.status(400).send("PostID is required.") }
    const post = await Post.findOne({_id: ObjectId(postID)})
    if (!post) { res.status(404).send("Post deletion process was unsucessful. Post was not found.") }
    if (post.imageKey) {unlink(`storage/${post.imageKey}`, () => {})}
    const sessionUserID = req.user._id.toString(); //the user session and its id
    // console.log(sessionUserID, post.authorID)
    if (!(post.authorID === sessionUserID)) { return res.status(403).send("Not enough permissions.") }
    const deletePost = await Post.deleteOne({_id: postID})
    if (deletePost) { return res.status(200).send("Sucessfully deleted the post.") }
    else{ return res.status(404).send("Post deletion process was unsucessful.") }
  }
  async heart(req, res){
    const postID = req.body.postID;
    let post;
    try{
        post = await Post.findOne({_id: ObjectId(postID)})
    }
    catch{
        return res.status(400).send("PostID or UserID is invalid.")
    }
    if (!post){
        return res.status(404).send("Post with ID does not exist.")
    }
    if (Object.keys(post.likerIDs).includes(req.user._id.toString())){
        const userID = req.user._id
        const {[userID]: _, ...modifiedLikerIDs} = post.likerIDs;
        await Post.updateOne(post, {likerIDs: modifiedLikerIDs})
    }
    else{
        const userID = req.user._id
        await Post.updateOne({_id: post._id}, {likerIDs: {...post.likerIDs, [userID]: new Date()}})
    }
    return res.status(200).send("Completed.")
  }
}
const Router = new Routes();
const postRouter = express.Router()

postRouter.get("/all", async (req, res) => {Route(req, res, Router.all)});
postRouter.post("/newpost", upload.single("image"), (req, res) => {ProtectedRoute(req, res, Router.newPost, ["file"])})
postRouter.get("/post", urlEncodedParser, async (req, res) => {Route(req, res, Router.post, ["id"])})
postRouter.post("/delete", urlEncodedParser, async (req, res) => {ProtectedRoute(req, res, Router.delete)})
postRouter.post("/heart", urlEncodedParser, async (req, res) => {ProtectedRoute(req, res, Router.heart)})
export default postRouter;
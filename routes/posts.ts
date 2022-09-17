import express from 'express';
import Post from "../models/Post.js";
import { Route } from "../utils/route.js";
import { ProtectedRoute } from "../utils/loginRequired.js";
import bodyParser from "body-parser";
import mongoose, { ObjectId } from 'mongoose';
import multer from 'multer';
import crypto from "crypto";
import { unlink } from "fs";
import { RequestInterface } from '../utils/RequestResponseInterfaces.js';
import { FileInterface } from '../utils/FileInterface.js';
import { PostInterface } from '../models/Post.js';
import { UserInterface } from '../models/User.js';

const urlEncodedParser = bodyParser.urlencoded({ extended: true })

interface FileTypeMapInterface {
  [key: string]: string
}
const FILE_TYPE_MAP: FileTypeMapInterface = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const storage = multer.memoryStorage()
const reversed: Function = (arr: Array<any>) => {
  let newArray = [];
  for (let i = arr.length - 1; i >= 0; i--){
    newArray.push(arr[i])
  }
  return newArray;
}
const upload = multer({ storage:storage })
const ObjectId = mongoose.Types.ObjectId

class Routes {
  async newPost(req: RequestInterface, res: express.Response){
    let text = req.body.text;
    if (text.length > 120) {
        return res.status(400).send("Limit for the post is 120 characters.")
    }
    const author = req.user
    const authorID = author!._id;
    const current_date = new Date();
    const likerIDs: Array<any> = []
    const comments: Array<any> = []
    const newPost = new Post({
        authorUsername: author!.username, 
        authorID: authorID, 
        date_created: current_date, 
        likerIDs: likerIDs, 
        comments: comments,
        text: text,
        image: req.file!.buffer
    });
    await newPost.save()
    return res.status(200).json(newPost._id)
  }
  async all(_: RequestInterface, res: express.Response) {
    const query = Post.find({});
    query.select("-image");
    const result:any = await query.exec()
    return res.json(reversed(result))
  }
  async post(req: RequestInterface, res: express.Response){
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
  async delete(req: RequestInterface, res: express.Response){
    const postID: string = req.body.postID.toString("hexc");
    if (!postID) { return res.status(400).send("PostID is required.") }
    const post: PostInterface | null = await Post.findOne({_id: new ObjectId(postID)})
    if (!post) { res.status(404).send("Post deletion process was unsucessful. Post was not found.") }
    const sessionUserID = req.user!._id.toString(); //the user session and its id
    // console.log(sessionUserID, post.authorID)
    if (!(post!.authorID === sessionUserID)) { return res.status(403).send("Not enough permissions.") }
    const deletePost = await Post.deleteOne({_id: postID})
    if (deletePost) { return res.status(200).send("Sucessfully deleted the post.") }
    else{ return res.status(404).send("Post deletion process was unsucessful.") }
  }
  async heart(req: RequestInterface, res: express.Response){
    const postID = req.body.postID;
    let post: PostInterface | null;
    try{
        post = await Post.findOne({_id: new ObjectId(postID)})
    }
    catch{
        return res.status(400).send("PostID is invalid.")
    }
    if (!post){
        return res.status(404).send("Post with ID does not exist.")
    }
    if (Object.keys(post.likerIDs).includes(req.user!._id.toString())){
        const userID: string = req.user!._id.toString("hex")
        const the_current_date:Date = new Date();
        const modifiedLikerIDs: PostInterface["likerIDs"] = {...post.likerIDs, [userID]: [the_current_date]};
        await Post.updateOne({_id: post._id}, {likerIDs: modifiedLikerIDs})
    }
    else{
        const userID = req.user!._id
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
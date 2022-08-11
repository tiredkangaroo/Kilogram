import express from 'express';
import User from "../models/User.js";
import Post from "../models/Post.js";
import loggedIn from "./loginRequired.js";
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import multer from 'multer';
import crypto from "crypto";

const urlEncodedParser = bodyParser.urlencoded({ extended: true })
const FILE_TYPE_MAP = {
    // mime type
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
};
const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null,'storage/');
    },
    filename : (req,file,cb) => {
        file.newName = crypto.randomBytes(32).toString("hex") + "." + FILE_TYPE_MAP[file.mimetype]
        cb(null, file.newName)
    }
  })
  

const upload = multer({ storage:storage })

const postRouter = express.Router()
const ObjectId = mongoose.Types.ObjectId

Array.prototype.reversed = function (){
    let newArray = [];
    for (let i = this.length - 1; i >= 0; i--){
      newArray.push(this[i])
    }
    return newArray;
}
postRouter.get("/all", async (req, res) => {
    const result = await Post.find({})
    return res.json(result.reversed())
})
const markdownTextEmojis = (md) => {
    const wrappingSymbol = ":" //: wraps the key, so :grin: will translate it into the grin
    const map = {
        "grin": "😃",
        "cry": "😢",
        "sob": "😭",
        "happycry": "🥲",
        "sunglasses": "😎",
        "party": "🎉",
        "ghost": "👻",
        "skull": "💀"
    }
    for (let i = 0; i < Object.keys(map).length; i++){
        let re = new RegExp(wrappingSymbol + Object.keys(map)[i] + wrappingSymbol, "g")
        md = md.replace(re, Object.values(map)[i])
    }
    return md;
}
postRouter.post("/newpost", upload.single("image"), async (req, res) => {
    const isLoggedIn = await loggedIn(req);
    if (!isLoggedIn[0]){return res.status(403).send("User must be logged in to create a post.")}; //if the user is not logged in
    let text = req.body.text;
    if (text){
        if (text.length > 150304) {
            return res.status(400).send("Limit for the post is 150,304 characters.")
        }
        text = markdownTextEmojis(text)
    }
    const authorID = isLoggedIn[1].userID; //userSession
    const author = await User.findOne({_id: ObjectId(authorID)})
    if (!author) { return res.status(404).send("User associated with session does not exist.") }
    const current_date = new Date();
    const likerIDs = []
    const comments = []
    const newPost = new Post({
        authorUsername: author.username, 
        authorID: authorID, 
        date_created: current_date, 
        likerIDs: likerIDs, 
        comments: comments
    });
    if (text){
        newPost.text = text;
    }
    if (req.file){
        newPost.imageKey = req.file.newName;
    }
    await newPost.save()
    return res.status(200).json(newPost._id)
})
postRouter.get("/post", urlEncodedParser, async (req, res) => {
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
})
postRouter.post("/delete", urlEncodedParser, async (req, res) => {
    const postID = req.body.postID;
    const isLoggedIn = await loggedIn(req);
    if (!postID) { return res.status(400).send("PostID is required.") }
    const post = await Post.findOne({_id: ObjectId(postID)})
    if (!post) { res.status(404).send("Post deletion process was unsucessful. Post was not found.") }
    const sessionUserID = isLoggedIn[1].userID //the user session and its id
    if (!(post.authorID === sessionUserID)) { return res.status(403).send("Not enough permissions.") }
    const deletePost = await Post.deleteOne({_id: postID})
    if (deletePost) { return res.status(200).send("Sucessfully deleted the post.") }
    else{ return res.status(404).send("Post deletion process was unsucessful.") }
})
postRouter.post("/heart", urlEncodedParser, async (req, res) => {
    const isLoggedIn = await loggedIn(req);
    const postID = req.body.postID;
    let post;
    let user;
    if (!isLoggedIn[0]){
        return res.status(403).send("Must be logged in to heart and unheart a post.")
    }
    if (!postID){
        return res.status(400).send("PostID is required.")
    }
    try{
        post = await Post.findOne({_id: ObjectId(postID)})
        user = await User.findOne({_id: ObjectId(isLoggedIn[1].userID)})
    }
    catch{
        return res.status(400).send("PostID or UserID is invalid.")
    }
    if (!post){
        return res.status(404).send("Post with ID does not exist.")
    }
    if (!user){
        return res.status(404).send("User session is invalid.")
    }
    const c = new Date();
    if (Object.keys(post.likerIDs).includes(user._id.toString())){
        const userID = user._id
        const {[userID]: _, ...modifiedLikerIDs} = post.likerIDs;
        await Post.updateOne(post, {likerIDs: modifiedLikerIDs})
    }
    else{
        const userID = user._id
        await Post.updateOne({_id: post._id}, {likerIDs: {...post.likerIDs, [userID]: new Date()}})
    }
    return res.status(200).send("Completed.")
})
export default postRouter;
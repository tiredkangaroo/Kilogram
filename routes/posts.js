import express from 'express';
import User from "../models/User.js";
import Post from "../models/Post.js";
import loggedIn from "./loginRequired.js";
import bodyParser from "body-parser";
import mongoose from 'mongoose';

const urlEncodedParser = bodyParser.urlencoded({ extended: false })
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
postRouter.post("/newpost", urlEncodedParser, async (req, res) => {
    const isLoggedIn = await loggedIn(req);
    if (!isLoggedIn[0]){return res.status(403).send("User must be logged in to create a post.")}; //if the user is not logged in
    const markdownText = req.body.markdownText;
    if (!markdownText) {return res.status(400).send(req.body)};
    const authorID = isLoggedIn[1].userID; //userSession
    const author = await User.findOne({_id: ObjectId(authorID)})
    if (!author) { return res.status(404).send("User associated with session does not exist.") }
    const current_date = new Date();
    const likerIDs = []
    const comments = []
    const newPost = new Post({authorEmail: author.email, authorID: authorID, markdownText: markdownText, date_created: current_date, likerIDs: likerIDs, comments: comments});
    await newPost.save()
    return res.status(200).send("Created post.")
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
export default postRouter;
import express from 'express';
import User from "../models/User.js";
import Post from "../models/Post.js";
import loggedIn from "./loginRequired.js";
import bodyParser from "body-parser";
import mongoose from 'mongoose';

const urlEncodedParser = bodyParser.urlencoded({ extended: false })
const postRouter = express.Router()
const ObjectId = mongoose.Types.ObjectId

postRouter.get("/all", async (req, res) => {
    const result = await Post.find({})
    let resultWithAuthors = [...result]
    resultWithAuthors.forEach(async (ele, idx) => {
        const result = await User.findOne({_id: ObjectId(ele.authorID)})
        ele.authorID = result.email
        resultWithAuthors[idx] = ele
        if (idx + 1 === resultWithAuthors.length){
            return res.json(resultWithAuthors)
        }
    })
    if (result.length === 0){
        res.json([])
    }
})
postRouter.post("/newpost", urlEncodedParser, async (req, res) => {
    const isLoggedIn = await loggedIn(req);
    if (!isLoggedIn[0]){return res.status(403).send("User must be logged in to create a post.")}; //if the user is not logged in
    const markdownText = req.body.markdownText;
    if (!markdownText) {return res.status(400).send(req.body)};
    const authorID = isLoggedIn[1].userID; //userSession
    const current_date = new Date();
    const likerIDs = []
    const comments = []
    const newPost = new Post({authorID: authorID, markdownText: markdownText, date_created: current_date, likerIDs: likerIDs, comments: comments});
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
export default postRouter;
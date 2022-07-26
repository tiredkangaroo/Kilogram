import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    authorEmail:{ //not to be inherited from User(authorID).email
        type: String,
        required: true
    },
    authorID: {
        type: String,
        required: true
    },
    markdownText: {
        type: String,
        required: true
    },
    date_created: {
        type: Date,
        required: true
    },
    likerIDs: { //array of userIDs that have liked this post
        type: Array,
        required: false
    },
    comments: { //2d array of [[userid, comment_text], [userid, comment_text]]
        type: Array,
        required: false
    }
})
const Post = mongoose.model('Post', PostSchema)
export default Post;
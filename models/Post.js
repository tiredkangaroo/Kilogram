import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    authorUsername:{ //not to be inherited from User(authorID).email
        type: String,
        required: true
    },
    authorID: {
        type: String,
        required: true
    },
    imageKey: {
        type: String,
        required: false, 
    },
    text: {
        type: String,
        required: false
    },
    date_created: {
        type: Date,
        required: true
    },
    likerIDs: { //Object of id and time {'jb2h52n', ISODate("2022-08-01T19:24:42.308Z")}
        type: Object,
        minimize: false,
        required: false
    },
    comments: { //Array of objects that have the userid, comment_text, and the time.
        // [{userID: 'jb2h52n', text: "yo that's fire", date: ISODate("2022-08-20T22:19:02.269Z")}] 
        type: Array,
        required: false
    }
})
const Post = mongoose.model('Post', PostSchema)
export default Post;
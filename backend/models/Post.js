import mongoose from "mongoose";
const PostSchema = new mongoose.Schema({
    authorUsername: {
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
    likerIDs: {
        type: Object,
        minimize: false,
        required: false
    },
    comments: {
        // [{username: "demo_user", userID: 'jb2h52n', text: "yo that's fire", date: ISODate("2022-08-20T22:19:02.269Z")}] 
        type: Array,
        required: false
    }
});
const Post = mongoose.model('Post', PostSchema);
export default Post;

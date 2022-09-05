import Post from "../models/Post.js";
export async function getPost(id) {
    let result;
    try {
        result = await Post.findOne({ _id: id });
    }
    catch (e) {
        return false;
    }
    if (result) {
        return result;
    }
    else {
        return false;
    }
}

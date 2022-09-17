import Post from "../models/Post.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
export async function getPost(id) {
    let result;
    try {
        // const objid:unknown = new ObjectId(id)
        // console.log(objid)
        result = await Post.findById(id);
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

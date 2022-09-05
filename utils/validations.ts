import { PostInterface } from "../models/Post.js";
import { getPost } from "./GetModelInstance.js";
import { RequestInterface } from "./RequestResponseInterfaces.js";
export class Validations{
  async post(req:RequestInterface){
    let requestedPost: unknown = await getPost(req.body.postID);
    if (requestedPost){
      req.post = requestedPost! as PostInterface;
    }
    return req.post;
  }
}
export async function validate(req:RequestInterface, validations:any=[]){
  for (let i = 0; i < validations.length; i++){
    try{
      if (!(await (validations[i])(req))){
        return false;
      }
    }
    catch (e){
      return false;
    }
  }
  return true;
}
import { getPost } from "../utils/GetModelInstance.js";
export class Validations{
  async post(req){
    req.post = await getPost(req.body.postID);
    return req.post;
  }
}
export async function validate(req, validations=[]){
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
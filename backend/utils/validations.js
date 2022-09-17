import { getPost } from "./GetModelInstance.js";
export class Validations {
    async post(req) {
        let useID;
        if (req.body.postID) {
            useID = req.body.postID;
        }
        else {
            useID = req.query.postID;
        }
        let requestedPost = await getPost(useID);
        if (requestedPost) {
            req.post = requestedPost;
        }
        // console.log(requestedPost)
        return req.post;
    }
}
export async function validate(req, validations = []) {
    for (let i = 0; i < validations.length; i++) {
        try {
            if (!(await (validations[i])(req))) {
                return false;
            }
        }
        catch (e) {
            return false;
        }
    }
    return true;
}

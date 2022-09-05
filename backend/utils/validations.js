import { getPost } from "./GetModelInstance.js";
export class Validations {
    async post(req) {
        let requestedPost = await getPost(req.body.postID);
        if (requestedPost) {
            req.post = requestedPost;
        }
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

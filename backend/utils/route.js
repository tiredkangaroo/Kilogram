import { loggedIn } from "./loginRequired.js";
import { required } from "./paramatersRequired.js";
import { validate } from "./validations.js";
export const validationSuccessfulText = "Validation successful.";
export const missingParamatersText = "Request failed, missing paramaters.";
export const validationsFailedText = "Validations failed.";
export async function Route(req, res, func, params_required = [], validations = []) {
    if (!required(req, params_required)) {
        return res.send(missingParamatersText);
    }
    if (!(await validate(req, validations))) {
        return res.send(validationsFailedText);
    }
    loggedIn(req); //if the user is logged in, a User object should be added to req.user
    func(req, res);
}

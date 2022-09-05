import { loggedIn } from "./loginRequired.js";
import { required } from "./paramatersRequired.js";
import { validate } from "./validations.js";
export const validationSuccessfulText = "Validation successful.";
export const missingParamatersText = "Request failed, missing paramaters.";
export const validationsFailedText = "Validations failed.";
export async function Route(req, res, func, params_required = [], validations = []) {
    required(req, params_required) ? validationSuccessfulText : res.send(missingParamatersText);
    await validate(req, validations) && !res.headersSent ? validationSuccessfulText : res.send(validationsFailedText);
    if (!res.headersSent) { //making sure that the code has not already failed
        loggedIn(req); //if the user is logged in, a User object should be added to req.user
        func(req, res);
    }
}

import { loggedIn } from "./loginRequired.js";
import { required } from "./paramatersRequired.js";
export const validationSuccessfulText = "Validation successful."
export const missingParamatersText = "Request failed, missing paramaters."
export function Route(req, res, func, params_required=[]){
  required(req, ...params_required) ? validationSuccessfulText : res.send(missingParamatersText);
  if (!res.headersSent){ //making sure that the code has not already failed
    loggedIn(req); //if the user is logged in, a User object should be added to req.user
    func(req, res);
  } 
}
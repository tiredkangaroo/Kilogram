import User, { UserInterface } from '../models/User.js';
import { required } from "./paramatersRequired.js";
import { validate } from "./validations.js";
import { validationSuccessfulText, missingParamatersText, validationsFailedText } from './route.js';
import Session from "../models/Session.js";
import { RequestInterface } from './RequestResponseInterfaces.js';
import express from 'express';
// export const loggedIn = async (req) => {
//     const userSession = await Session.findOne({tokenID: req.cookies.session})
//     return [Boolean(userSession), userSession]; //if the user is logged in, the session
// }
export const loggedIn = async (req: RequestInterface) => {
  let user: UserInterface | null;
  if (req.cookies.session){
    const session = await Session.findOne({tokenID: req.cookies.session});
    if (!session){ return false }
    user = await User.findOne({_id: session.userID})
    if (!user) { return false }
  }
  else{
    return false;
  }
  req.user = user;
  return true;
}
export const noAuthMessage = (res: express.Response) => (
  res.status(403).send("Authentication is required.")
)
export const ProtectedRoute = async (req: RequestInterface, res: express.Response, func: Function, params_required:any=[], validations:any=[]) => {
  required(req, params_required as []) ? validationSuccessfulText : res.status(400).send(missingParamatersText);
  await validate(req, validations) && !res.headersSent ? validationSuccessfulText : res.send(validationsFailedText);

  if (!res.headersSent){
    await loggedIn(req) ? await func(req, res) : noAuthMessage(res);
  }
}
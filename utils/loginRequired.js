import User from '../models/User.js';
import Session from "../models/Session.js";
// export const loggedIn = async (req) => {
//     const userSession = await Session.findOne({tokenID: req.cookies.session})
//     return [Boolean(userSession), userSession]; //if the user is logged in, the session
// }
export const loggedIn = async (req) => {
  let user;
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
export const noAuthMessage = (res) => (
  res.status(403).send("Authentication is required.")
)
export const ProtectedRoute = async (req, res, func, params_required=[]) => {
  required(req, ...params_required) ? validationSuccessfulText : res.send(missingParamatersText);
  await loggedIn(req) ? await func(req, res) : noAuthMessage(res);
}
import Session from "../models/Session.js";
const loggedIn = async (req) => {
    const userSession = await Session.findOne({tokenID: req.cookies.session})
    return [Boolean(userSession), userSession]; //if the user is logged in, the session
}
export default loggedIn;
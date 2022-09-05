import express from "express";
import bodyParser from "body-parser";
import validator from "validator";
import User from "../models/User.js";
import { UserInterface } from "../models/User.js";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import Session from "../models/Session.js";
import { google } from "googleapis";
import dotenv from 'dotenv';
import Post from "../models/Post.js";
import { ProtectedRoute } from "../utils/loginRequired.js";
import { Route } from "../utils/route.js";
import { RequestInterface } from "../utils/RequestResponseInterfaces.js";

const OAuth2 = google.auth.OAuth2;
const authrouter = express.Router()
const urlEncodedParser = bodyParser.urlencoded({ extended: false })
dotenv.config();

const createSession = (user: UserInterface | any, res: express.Response) => {
  const three_months_from_now = new Date();
  three_months_from_now.setDate(three_months_from_now.getDay() + 90);
  const newSession = new Session({
      tokenID: crypto.randomBytes(256).toString('hex'),
      userID: user._id,
      expiry: three_months_from_now
  })
  newSession.save()
  res.cookie('session', newSession.tokenID, {
      maxAge: 86400 * 1000 * 90, // 90 days from now
      httpOnly: true, // http only, prevents JavaScript cookie access
  });
}
const checkPassword = async (password: string, realPassword: string) => {
  return new Promise((resolve) => {
    bcrypt.compare(password, realPassword, (err, bcryptResult) => {
      if (err || !bcryptResult){
        resolve(false);
      }
      else{
        resolve(true);
      }
  })})
}
class Routes{
  async login(req: RequestInterface, res: express.Response){
    const email = req.body.email;
    const password = req.body.password;
    if (email === "demo@demo.com"){
        const result = await User.findOne({username: "demo_user"}) as UserInterface;
        createSession(result, res);
        return res.status(200).json({email: "demo@demo.com"})
    }
    let result: UserInterface | null = await User.findOne({email: email});
    if (result && await checkPassword(password, result!.password)){
      await Session.deleteOne({userID: result!._id})
      createSession(result, res);
      res.json({email: email});
    }
    else{
      res.status(403).send("The username or password is incorrect.")
    }
  }
  async logout(req: RequestInterface, res: express.Response){
    const sessionCookie = req.cookies.session
    await Session.deleteOne({tokenID: sessionCookie})
    res.cookie('session', sessionCookie, {
        maxAge: 0,
        httpOnly: true
    })
    return res.status(200).send("Logged out.")
  }
  async register(req: RequestInterface, res: express.Response){
    const new_username = req.body.username
    const new_email = req.body.email
    const new_password = req.body.password
    const password_confirmation = req.body.password_confirmation
    const result = await User.findOne({email: new_email})
    if (result){
        return res.status(400).send("User already exists. Please login instead.")
    }
    if (!new_email || !new_password || !new_username || !password_confirmation){
        return res.status(400).send("All fields must be filled out.")
    }
    if (!validator.isEmail(new_email)){
        return res.status(400).send("Email must be valid")
    }
    if (new_username.includes(" ")){
        return res.status(400).send("Username must not contain a space.")
    }
    if (new_password.length < 8){
        return res.status(400).send("The length of the password must be 8 or greater.")
    }
    if (new_password > 256){
        return res.status(400).send("The length of the password must be no more than 256.")
    }
    if (new_password != password_confirmation){
        return res.status(400).send("The password's must match.")
    }
    bcrypt.hash(new_password, bcrypt.genSaltSync(10), async (err: any, response: any) => {
        if (err){
            return res.status(500).send("An unknown error occurred while creating the account.")
        }
        else{
            const encryptedPassword = response
            const new_user = new User({email: new_email, username: new_username, password: encryptedPassword})
            await new_user.save();
            createSession(new_user, res);
            return res.status(200).send(`Registered ${new_email}.`)
        }
    })
  }
  getCurrentUser(req: RequestInterface, res: express.Response){
    return res.status(200).json({"email": req.user!.email, "username": req.user!.username, "id": req.user!._id})
  }
  async userDetails(req: RequestInterface, res: express.Response){
    const username = req.query.username;
    const result = await User.findOne({username: username})
    const posts = await Post.find({authorID: result!._id})
    res.json({
      email: result!.email, 
      username: result!.username,
      posts: posts,
    })
  }
}

const Router = new Routes();
authrouter.post("/login", urlEncodedParser, async (req, res) => { Route(req, res, Router.login, ["email", "password"]) })
authrouter.get("/logout", urlEncodedParser, async (req, res) => { ProtectedRoute(req, res, Router.logout) })
authrouter.post("/register", urlEncodedParser, async (req, res) => { Route(req, res, Router.register, ["username", "email", "password", "password_confirmation"])})
authrouter.get("/whoami", urlEncodedParser, async (req, res) => { ProtectedRoute(req, res, Router.getCurrentUser) })
authrouter.get("/userdetails", urlEncodedParser, async (req, res) => { Route(req, res, Router.userDetails, ["username"])})
export default authrouter;
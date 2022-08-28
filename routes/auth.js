import express from "express";
import bodyParser from "body-parser";
import validator from "validator";
import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import Session from "../models/Session.js";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from 'dotenv';
import Post from "../models/Post.js";
import { ProtectedRoute } from "../utils/loginRequired.js";
import { Route } from "../utils/route.js";
const OAuth2 = google.auth.OAuth2;
const authrouter = express.Router()
const urlEncodedParser = bodyParser.urlencoded({ extended: false })

dotenv.config();

const createSession = (user, res) => {
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
const checkPassword = async (password, realPassword) => {
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
  async login(req, res){
    const email = req.body.email;
    const password = req.body.password;
    if (email === "demo@demo.com"){
        const result = await User.findOne({username: "demo_user"});
        createSession(result, res);
        return res.status(200).json({email: "demo@demo.com"})
    }
    const result = await User.findOne({email: email});
    if (result && await checkPassword(password, result.password)){
      await Session.deleteOne({userID: result._id})
      createSession(result, res);
      res.json({email: email});
    }
    else{
      res.status(403).send("The username or password is incorrect.")
    }
  }
  async logout(req, res){
    const sessionCookie = req.cookies.session
    await Session.deleteOne({tokenID: sessionCookie})
    res.cookie('session', sessionCookie, {
        maxAge: 0,
        httpOnly: true
    })
    return res.status(200).send("Logged out.")
  }
  async register(req, res){
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
    bcrypt.hash(new_password, bcrypt.genSaltSync(10), (err, response) => {
        if (err){
            return res.status(500).send("An unknown error occurred while creating the account.")
        }
        else{
            const encryptedPassword = response
            const confirmToken = crypto.randomBytes(256).toString('hex')
            const new_user = new User({email: new_email, username: new_username, password: encryptedPassword, confirmToken: confirmToken, confirmed: false})
            new_user.save();
            createSession(new_user, res);
            return res.status(200).send(confirmToken)
        }
    })
  }
  getCurrentUser(req, res){
    return res.status(200).json({"email": req.user.email, "username": req.user.username, "id": req.user._id})
  }
  async sendConfirmationToken(req, res){
    const token = req.body.token;
    const email = req.body.email;
    const result = await sendEmail({
      subject: "Verify your email with The Kilogram Project",
      cc: [email],
      from: "The Kilogram Team",
      html: `<h1>Verify your Email</h1><p>Someone has created a Kilogram account with <i data-hover="${email}">this</i> email.</p><div class="mass"><div class="parent-a-button"><a style="color: red;" href="http://localhost:3000/confirm#${token}"><button class="verify" type="button">Verify your Email</button></a></div></div><p style="font-size: 0.8rem;" class="above-link">If the above link does not work, please click <a style="color: red;" href="http://localhost:3000/confirm#${token}">this link</a>.</p></div><style>html{text-align: center; background-color: #a1ffe0; display: flex; align-items: center; justify-content: center; text-align: center; vertical-align: middle;}.verify{background-color: transparent; border: 1px solid black; background-color: transparent; width: 40vw; height: 20vh; left: 40vw; color: black; border-radius: 8px;} .verify:hover{background-color: #363636; transition: 0.5s; color: white;} .parent-a-button{display: flex; align-items: center; justify-content: center; text-align: center; vertical-align: center;} .mass{position: absolute; left: 30%; top: 38%;} .above-link{ position: absolute; bottom: 0; left: 40%}</style>`
    })
    res.send(result);
  }
  async confirm(req, res){
    const token = req.query.token;
    const result = await User.findOneAndUpdate({confirmToken: token}, {confirmed: true});
    if (result){
      createSession(result, res);
      res.send("Confirmed account.")
    }
    else{
      res.status(404).send("Failed.")
    }
  }
  async userDetails(req, res){
    const username = req.query.username;
    const result = await User.findOne({username: username})
    const posts = await Post.find({authorID: result._id})
    res.json({
      email: result.email, 
      username: result.username,
      posts: posts,
      confirmed: result.confirmed
    })
  }
}

//https://github.com/leochung97/LineAlert/blob/main/routes/api/nodemailer.js
const createTransporter = async () => {
    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );
  
    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });
  
    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject("Access token failure.");
        }
        resolve(token);
      });
    });
  
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        accessToken,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
      },
    });
    return transporter;
};

const sendEmail = async (emailOptions) => {
    let emailTransporter = await createTransporter();
    try {
        await emailTransporter.sendMail(emailOptions);
    } 
    catch (error) {
        console.log(error);
    }
};
const Router = new Routes();
authrouter.post("/login", urlEncodedParser, async (req, res) => { Route(req, res, Router.login, ["email", "password"]) })
authrouter.get("/logout", urlEncodedParser, async (req, res) => { ProtectedRoute(req, res, Router.logout) })
authrouter.post("/register", urlEncodedParser, async (req, res) => { Route(req, res, Router.register, ["username", "email", "password", "password_confirmation"])})
authrouter.get("/whoami", urlEncodedParser, async (req, res) => { ProtectedRoute(req, res, Router.getCurrentUser) })
authrouter.post("/sendConfirmationToken", urlEncodedParser, async (req, res) => { ProtectedRoute(req, res, Router.sendConfirmationToken, ["token", "email"]) })
authrouter.get("/confirm", (req, res) => { Route(req, res, Router.confirm, ["token"])})
authrouter.get("/userdetails", urlEncodedParser, async (req, res) => { Route(req, res, Router.userDetails, ["username"])})
export default authrouter;
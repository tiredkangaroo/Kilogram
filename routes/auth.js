import express  from "express";
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
import mongoose from "mongoose";

const OAuth2 = google.auth.OAuth2;
const authrouter = express.Router()
const urlEncodedParser = bodyParser.urlencoded({ extended: false })
const ObjectId = mongoose.Types.ObjectId

dotenv.config();

authrouter.post("/register", urlEncodedParser, (req, res) => {
    const new_username = req.body.username
    const new_email = req.body.email
    const new_password = req.body.password
    const password_confirmation = req.body.password_confirmation
    User.findOne({email: new_email}).then((result) => {
        if (result){
            return res.status(400).send("User already exists. Please login instead.")
        }
        else{
            if (!new_email || !new_password || !new_username || !password_confirmation){
                return res.status(400).send("All fields must be filled out.")
            }
            if (!validator.isEmail(new_email)){
                return res.status(400).send("Email must be valid")
            }
            User.findOne({username: new_username}).then((usernameResult) => {
                if (usernameResult){
                    return res.status(400).send("Username already in use.")
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
                        new_user.save()
                        // const three_months_from_now = new Date();
                        // three_months_from_now.setDate(three_months_from_now.getDay() + 90);
                        // const newSession = new Session({
                        //     tokenID: crypto.randomBytes(256).toString('hex'),
                        //     userID: new_user._id,
                        //     expiry: three_months_from_now
                        // })
                        // newSession.save()
                        // res.cookie('session', newSession.tokenID, {
                        //     maxAge: 86400 * 1000 * 90, // 90 days from now
                        //     httpOnly: true, // http only, prevents JavaScript cookie access
                        // });
                        return res.status(200).send(confirmToken)
                    }
                })
            })
        }
    })
})
authrouter.post("/login", urlEncodedParser, (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password){
        return res.status(400).send("All fields must be filled out.")
    }
    if (email === "demo@demo.com"){
        const three_months_from_now = new Date();
        three_months_from_now.setDate(three_months_from_now.getDay() + 90);
        const newSession = new Session({
            tokenID: crypto.randomBytes(256).toString('hex'),
            userID: ObjectId("62e986bbab456c4855549137"),
            expiry: three_months_from_now
        })
        newSession.save()
        res.cookie('session', newSession.tokenID, {
            maxAge: 86400 * 1000 * 90, // 90 days from now
            httpOnly: true, // http only, prevents JavaScript cookie access
        });
        return res.status(200).json({email: "demo@demo.com"})
    }
    User.findOne({email: email}).then((result) => {
        if (result){
            if (!result.confirmed){
                return res.status(404).send("Login is not allowed, you must confirm your email.")
            }
            bcrypt.compare(password, result.password, (err, bcryptResult) => {
                if (err){
                    return res.status(500).send("An unknown error occured when logging in.")
                }
                else{
                    if (!bcryptResult){
                        return res.status(403).send("The username or password is incorrect.")
                    }
                    Session.deleteMany({userID: result._id})
                    const three_months_from_now = new Date();
                    three_months_from_now.setDate(three_months_from_now.getDay() + 90);
                    const newSession = new Session({
                        tokenID: crypto.randomBytes(256).toString('hex'),
                        userID: result._id,
                        expiry: three_months_from_now
                    })
                    newSession.save()
                    res.cookie('session', newSession.tokenID, {
                        maxAge: 86400 * 1000 * 90, // 90 days from now
                        httpOnly: true, // http only, prevents JavaScript cookie access
                    });
                    return res.status(200).json({email: result.email})
                }
            })
        }
        else{
            return res.status(404).send("No account associated with the email address. Please sign up.")
        }
    })
})
authrouter.get("/logout", (req, res) => {
    const sessionCookie = req.cookies.session
    if (sessionCookie){
        Session.deleteOne({tokenID: sessionCookie}).then((result) => {
            if (result){
                res.cookie('session', sessionCookie, {
                    maxAge: 0,
                    httpOnly: true
                })
                return res.status(200).send("Logged out.")
            }
            else{
                res.status(404).send("No session found.")
            }
        })
    }
    else{
        res.status(404).send("No session cookie found.")
    }
})
authrouter.get("/whoami", (req, res) => {
    if (req.cookies.session){
        Session.findOne({tokenID: req.cookies.session}).then((result) => {
            if (result){
                const currentDate = new Date()
                if (result.expiry - currentDate <= 0){
                    res.cookie("session", req.cookies.session, {maxAge: 0})
                    return res.status(404).send("Did not find a valid token. Token expired. Please log in again.")
                }
                User.findOne({"_id": result.userID}).then((result) => {
                    if (result){
                        return res.json({"email": result.email, "username": result.username, "id": result._id})
                    }
                    else{
                        res.status(404).send("Did not find a user associated with the token.")
                    }
                })
            }
            else{
                return res.status(404).send("Did not find session token as valid.")
            }
        })
    }
    else{
        return res.status(404).send("User is not logged in. Did not find session token.")
    }
})
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
authrouter.post("/sendConfirmationToken", urlEncodedParser, async (req, res) => {
    const token = req.body.token;
    const email = req.body.email;
    if (!token || !email){
        return res.status(404).send("Provide token/email.")
    }
    sendEmail({
        subject: "Verify your Email",
        cc: [email],
        from: "Kilogram",
        html: `<h1>Verify your Email</h1><p>Someone has created a Kilogram account with <i data-hover="${email}">this</i> email.</p><div class="mass"><div class="parent-a-button"><a style="color: red;" href="http://localhost:3000/confirm#${token}"><button class="verify" type="button">Verify your Email</button></a></div></div><p style="font-size: 0.8rem;" class="above-link">If the above link does not work, please click <a style="color: red;" href="http://localhost:3000/confirm#${token}">this link</a>.</p></div><style>html{text-align: center; background-color: #a1ffe0; display: flex; align-items: center; justify-content: center; text-align: center; vertical-align: middle;}.verify{background-color: transparent; border: 1px solid black; background-color: transparent; width: 40vw; height: 20vh; left: 40vw; color: black; border-radius: 8px;} .verify:hover{background-color: #363636; transition: 0.5s; color: white;} .parent-a-button{display: flex; align-items: center; justify-content: center; text-align: center; vertical-align: center;} .mass{position: absolute; left: 30%; top: 38%;} .above-link{ position: absolute; bottom: 0; left: 40%}</style>`
    }).then((e) => {console.log(e); res.send("omg it legit worked lol")}).catch((e) => {res.send(e)})
})
authrouter.get("/confirm", (req, res) => {
    const token = req.query.token;
    if (token){
        User.findOne({confirmToken: token, confirmed: false}).then(async (result) => {
            if (result){
                await User.findOneAndUpdate({confirmToken: token, confirmed: false}, {confirmed: true})
                await Session.deleteMany({userID: result._id})
                const three_months_from_now = new Date();
                three_months_from_now.setDate(three_months_from_now.getDay() + 90);
                const newSession = new Session({
                    tokenID: crypto.randomBytes(256).toString('hex'),
                    userID: result._id,
                    expiry: three_months_from_now
                })
                newSession.save()
                res.cookie('session', newSession.tokenID, {
                    maxAge: 86400 * 1000 * 90, // 90 days from now
                    httpOnly: true, // http only, prevents JavaScript cookie access
                });
                return res.status(200).send("Email confirmed.")
            }
            else{
                return res.status(404).send("No user that has not already been confirmed with that token.")
            }
        })
    }
    else{
        return res.status(404).send("Make sure to send the token.")
    }
})
authrouter.get("/userdetails", async (req, res) => {
    const username = req.query.username;
    if (!username) {return res.status(400).send("Username is a required parameter.")}
    const result = await User.findOne({username: username})
    if (!result) {return res.status(404).send("User not found.")}
    const posts = await Post.find({authorID: result._id})
    res.json({email: result.email, username: result.username, posts: posts, confirmed: result.confirmed});
})
export default authrouter;
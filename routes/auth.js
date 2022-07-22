import express  from "express";
import bodyParser from "body-parser";
import validator from "validator";
import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import Session from "../models/Session.js";

const authrouter = express.Router()
const urlEncodedParser = bodyParser.urlencoded({ extended: false })

authrouter.post("/register", urlEncodedParser, (req, res) => {
    const new_email = req.body.email
    const new_password = req.body.password
    const password_confirmation = req.body.password_confirmation
    User.findOne({email: new_email}).then((result) => {
        if (result){
            return res.send("User already exists. Please login instead.")
        }
        else{
            if (!new_email || !new_password || !password_confirmation){
                return res.status(400).send("All fields must be filled out.")
            }
            if (!validator.isEmail(new_email)){
                return res.status(400).send("Email must be valid")
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
                    const new_user = new User({email: new_email, password: encryptedPassword})
                    new_user.save()
                    const three_months_from_now = new Date();
                    three_months_from_now.setDate(three_months_from_now.getDay() + 90);
                    const newSession = new Session({
                        tokenID: crypto.randomBytes(256).toString('hex'),
                        userID: new_user._id,
                        expiry: three_months_from_now
                    })
                    newSession.save()
                    res.cookie('session', newSession.tokenID, {
                        maxAge: 86400 * 1000 * 90, // 90 days from now
                        httpOnly: true, // http only, prevents JavaScript cookie access
                    });
                    return res.status(200).send("User successfully created.")
                }
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
    User.findOne({email: email}).then((result) => {
        if (result){
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
                        return res.json({"email": result.email})
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
export default authrouter;
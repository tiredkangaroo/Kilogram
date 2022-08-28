import User from "./models/User.js";
import Post from "./models/Post.js";
import Session from "./models/Session.js";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import crypto from "crypto";
import path from "path";
import fs from "fs";

dotenv.config();
const protectedFiles = ["billabong.ttf", "favicon.ico", "Noe-Text-Bold.ttf", "Noe-Text-Regular.ttf"]


console.log("Connecting to MongoDB.")
//Connect to DB
const Connect = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
}
await Connect();
console.log("Connected to MongoDB.")

console.log("Deleting all data in the database.")
const DeleteAll = async () => {
  fs.readdir(path.resolve() + "/storage", (err, files) => {
    if (err){
      console.error(err);
    }
    else{
      files.forEach((file) => {
        if (!(protectedFiles.includes(file))){
          fs.unlink(path.resolve() + "/storage/" + file, (err) => {
            if (err){
              console.log(`Unable to delete ${path.resolve() + "/storage/" + file}.`)
            }
            else{
              console.log(`Deleted ${path.resolve() + "/storage/" + file}.`)
            }
          });
        }
      })
    }
  })
  await User.deleteMany({});
  await Post.deleteMany({});
  await Session.deleteMany({});
}
await DeleteAll();
console.log("Deleted all data in the database.")

console.log("Setting up demo user.")
const SetupDemoUser = async () => {
  const email = "demo_user@demo.com"
  const username = "demo_user";
  const password = crypto.randomBytes(256).toString("hex"); //This password does not matter.
  const confirm_token = crypto.randomBytes(256).toString("hex");
  const confirmed = true;
  const demo_user = new User({email: email, username: username, password: password, confirmToken: confirm_token, confirmed: confirmed, date_created: new Date()})
  await demo_user.save();
}
await SetupDemoUser();
console.log("Set up demo user.")

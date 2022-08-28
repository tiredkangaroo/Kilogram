import User from "./models/User.js";
import Post from "./models/Post.js";
import Session from "./models/Session.js";
import crypto from "crypto";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import imageDownloader from "image-downloader";
import path from "path";
import fs from "fs";
import fetch from "node-fetch";

dotenv.config();
const protectedFiles = ["billabong.ttf", "favicon.ico", "Noe-Text-Bold.ttf", "Noe-Text-Regular.ttf"]
console.log("Starting seeding process...")
console.log("Connecting to MongoDB.")
//Connect to DB
const Connect = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
}
await Connect();
console.log("Connected to MongoDB.")
// Reset
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

console.log("Setting up seed user.")
const SetupUser = async () => {
  const usernames = ["emergency_pocket", "crew_declare", "deposit_paramedic", "friendlyequal", "prickly_dog", "the_best_programmer"]
  const email = "seeder@seeds.com";
  const username = usernames[Math.floor(Math.random() * 6)];
  const password = crypto.randomBytes(256).toString("hex"); //This account should not be accessible by ANYONE.
  const confirmToken = crypto.randomBytes(256).toString("hex") //The confirm token on /confirm can be used as a way into the account. This should remain inacessable.
  const confirmed = true;
  const SeederUser = new User({email: email, username: username, password: password, confirmToken: confirmToken, confirmed});
  await SeederUser.save();
}
await SetupUser();
console.log("Setup seed user.")

console.log("Setting up 20 posts.")
const SetupPosts = async () => {
  const author = await User.findOne({})
  async function downloadImage(url, filepath) {
    return imageDownloader.image({
      url,
      dest: filepath
    })
  }
  async function getQuote(){
    const url = "https://api.muetab.com/quotes/random?language=English"
    const quoteResponse = await fetch(url);
    const quoteBlob = await quoteResponse.blob();
    const quoteText = await quoteBlob.text();
    const quoteJSON = JSON.parse(quoteText);
    const quote = quoteJSON.quote;
    return quote;
  }
  for (let i = 0; i < 20; i++){
    const key = crypto.randomBytes(32).toString("hex");
    const quote = await getQuote();
    await downloadImage("https://picsum.photos/400/200", path.resolve() + `/storage/${key}.jpg`);
    const NewPost = new Post({authorUsername: "Seeder", authorID: author._id, text: quote, imageKey: key + ".jpg", date_created: new Date()});
    NewPost.save();
  }
}
await SetupPosts();
console.log("Set up all 20 posts.")
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
console.log("Seeding process successful.")
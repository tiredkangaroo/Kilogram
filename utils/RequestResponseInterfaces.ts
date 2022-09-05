import express from "express";
import { UserInterface } from "../models/User.js";
import { PostInterface } from "../models/Post.js";
import { FileInterface } from "./FileInterface.js";

export interface RequestInterface extends express.Request {
  user?: UserInterface,
  post?: PostInterface,
  file?: FileInterface | undefined
}

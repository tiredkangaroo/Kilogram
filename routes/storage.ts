import express from "express";
import bodyParser from "body-parser";

import { Route } from "../utils/route.js";
import { Validations } from "../utils/validations.js";

import { PostInterface } from "../models/Post.js";
import { RequestInterface } from "../utils/RequestResponseInterfaces.js";


const StorageRouter = express.Router()
const urlEncodedParser = bodyParser.urlencoded({ extended: true })

class StorageRoutes {
  getImage(req: RequestInterface, res: express.Response){
    const post: PostInterface = req.post!;
    const encodedBuffer: Buffer = post.image;
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": encodedBuffer.length
    });
    res.end(encodedBuffer);
  }
}

const Router = new StorageRoutes();
const Validator = new Validations();

StorageRouter.get("*", urlEncodedParser, (req: RequestInterface, res: express.Response) => {Route(req, res, Router.getImage, [], [Validator.post])})

export default StorageRouter;
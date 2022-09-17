import express from "express";
import path from "path";
import fs from "fs";
import User from "../models/User.js";
import Session from "../models/Session.js";
import Post from "../models/Post.js";
import { Route } from "../utils/route.js";
const DatabaseDeveloperRouter = express.Router();
class Routes {
    async index(req, res) {
        fs.readFile(path.resolve() + '/routes/ddr.html', async (err, data) => {
            if (err) {
                res.send(`<pre>${err}</pre>`);
            }
            else {
                const dbdata = JSON.stringify({ user: await User.find({}), session: await Session.find({}), post: await Post.find({}) });
                res.send(`<script>window.data = ${dbdata}</script>${data}`);
            }
        });
        // res.send()
    }
}
const Router = new Routes();
DatabaseDeveloperRouter.get("/", (req, res) => { Route(req, res, Router.index, []); });
export default DatabaseDeveloperRouter;

import {Express} from "express";
import multer from "multer";

export interface FileInterface extends Express.Multer.File {
  newName?: string
}
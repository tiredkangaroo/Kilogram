import { Express } from "express";

export interface FileInterface extends Express.Multer.File {
  newName?: string
}
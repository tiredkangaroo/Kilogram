import mongoose from "mongoose";

export interface SessionInterface extends mongoose.Document {
  tokenID: string,
  userID: string,
  expiry: Date
}

const SessionSchema = new mongoose.Schema({
    tokenID: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    expiry: {
        type: Date,
        required: true
    }
})

const Session = mongoose.model("Session", SessionSchema)
export default Session;
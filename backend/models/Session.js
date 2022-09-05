import mongoose from "mongoose";
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
});
const Session = mongoose.model("Session", SessionSchema);
export default Session;

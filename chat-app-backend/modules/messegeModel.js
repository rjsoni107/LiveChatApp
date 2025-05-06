const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    room: { type: String, required: true },
    sender: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
}, { versionKey: false, collection: process.env.MONGO_DB_MESSAGE });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
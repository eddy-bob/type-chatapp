"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// define enum
var ChatEnum;
(function (ChatEnum) {
    ChatEnum["DELIVERED"] = "DELIVERED";
    ChatEnum["READ"] = "READ";
})(ChatEnum || (ChatEnum = {}));
const { Schema, model } = require("mongoose");
const GroupMessage = new Schema({
    group: {
        type: Schema.ObjectId,
        ref: "Group",
    },
    sender: {
        type: Schema.ObjectId || String,
        ref: "User",
        default: "NotifBot"
    },
    senderName: {
        type: String,
        required: [true, "please include a  sender name"],
    },
    message: {
        type: String,
        trim: true,
        required: [true, "please include a group message"],
    },
    status: { type: String, enum: ChatEnum, default: "DELIVERED" },
    hideFrom: { type: [Schema.ObjectId], ref: "User" },
    attatchment: {
        type: [String],
        default: []
    }
}, { timestamps: true });
exports.default = model("GroupChats", GroupMessage);
//# sourceMappingURL=GroupMessages.js.map
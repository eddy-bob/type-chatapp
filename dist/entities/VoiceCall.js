"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Schema, model } = require("mongoose");
// define enum
var CallEnum;
(function (CallEnum) {
    CallEnum["INITIALIZED"] = "INITIALIZED";
    CallEnum["REJECTED"] = "REJECTED";
    CallEnum["ENDED"] = "ENDED";
    CallEnum["ACCEPTED"] = "ACCEPTED";
})(CallEnum || (CallEnum = {}));
const PrivateVoiceCall = new Schema({
    caller: {
        type: Schema.ObjectId,
        ref: "User",
        required: [true, "please provide a caller"],
    },
    callerName: {
        type: String,
        required: [true, "please include a  sender name"],
    },
    reciever: {
        type: Schema.ObjectId,
        ref: "User",
        required: [true, "please provide a reciever"],
    },
    hideFrom: { type: Schema.ObjectId, ref: "User" },
    status: { type: String, enum: CallEnum, default: CallEnum.INITIALIZED },
}, { timestamps: true });
exports.default = model("PrivateVoiceCall", PrivateVoiceCall);
//# sourceMappingURL=VoiceCall.js.map
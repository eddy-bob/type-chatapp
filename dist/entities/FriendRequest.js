"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const genFullName_1 = __importDefault(require("../utils/genFullName"));
const { Schema, model } = require("mongoose");
const FriendRequest = new Schema({
    reciever: {
        type: Schema.ObjectId,
        ref: "User",
        required: [true, "please provide a friend request reciever"],
    },
    PendingFriend: {
        type: Schema.ObjectId,
        ref: "User",
        required: [true, "please provide a friend request sender"],
    },
    pendingFriendName: {
        type: String
    },
    pendingFriendPhoto: {
        MimeType: String,
        size: String,
        url: String
    },
}, { timestamps: true });
FriendRequest.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("e reach here oo");
        console.log(this.PendingFriend);
        let response = yield (0, genFullName_1.default)(this.PendingFriend);
        this.pendingFriendName = response[0];
        this.pendingFriendPhoto = response[1];
        return next();
    });
});
exports.default = model("FriendRequestSchm", FriendRequest);
//# sourceMappingURL=FriendRequest.js.map
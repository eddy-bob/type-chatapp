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
const { Schema, model } = require("mongoose");
const genFullName_1 = __importDefault(require("../utils/genFullName"));
const FriendSchema = new Schema({
    owner: {
        type: Schema.ObjectId,
        ref: "userMod",
        required: [true, "please provide a friend owner"],
    }, friend: {
        type: Schema.ObjectId,
        ref: "userMod",
        required: [true, "please provide a friend"],
    },
    friendName: {
        type: String
    },
    photo: {
        MimeType: String,
        size: String,
        url: String
    },
    blocked: { type: Boolean, default: false },
}, { timestamps: true });
FriendSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield (0, genFullName_1.default)(this.friend);
        this.friendName = response[0];
        this.photo = response[1];
        next();
    });
});
exports.default = model("FriendSc", FriendSchema);
//# sourceMappingURL=Friend.js.map
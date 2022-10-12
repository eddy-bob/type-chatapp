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
const success_response_1 = __importDefault(require("../helpers/success.response"));
const customError_1 = require("../helpers/customError");
const RecentPrivateChat_1 = __importDefault(require("../entities/RecentPrivateChat"));
;
const recentChat = {
    getRecentChats: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req;
        try {
            const chats = yield RecentPrivateChat_1.default.find({ owner: userId }).sort({ createdAt: -1 });
            console.log(chats);
            return (0, success_response_1.default)(res, chats, 200, "Recent chats fetched successfully");
        }
        catch (err) {
            next(new customError_1.customError(err.message, 500));
        }
    }),
    addRecentChat: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req;
        try {
            console.log(req.body);
            yield RecentPrivateChat_1.default.deleteOne({ owner: userId, friend: req.body.friend });
            yield RecentPrivateChat_1.default.deleteOne({ friend: userId, owner: req.body.friend });
            const chats = yield RecentPrivateChat_1.default.create({ owner: userId, friend: req.body.friend, relationship: req.body.relationship });
            yield chats.save();
            console.log("e reach ooooo");
            const reverseChats = yield RecentPrivateChat_1.default.create({ owner: req.body.friend, friend: userId, relationship: req.body.relationship });
            yield reverseChats.save();
            console.log(chats, "na recent be this");
            const recentChats = yield RecentPrivateChat_1.default.find({ owner: userId }).sort({ createdAt: -1 });
            return (0, success_response_1.default)(res, recentChats, 200, "Recent chats created successfully");
        }
        catch (err) {
            next(new customError_1.customError(err.message, 500));
        }
    }),
};
exports.default = recentChat;
//# sourceMappingURL=recent-private-chat.controller.js.map
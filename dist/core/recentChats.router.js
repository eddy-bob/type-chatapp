"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recent_private_chat_controller_1 = __importDefault(require("../controllers/recent-private-chat.controller"));
const recentPrivateChatRouter = (0, express_1.Router)();
const secure_1 = __importDefault(require("../middlewares/secure"));
recentPrivateChatRouter.use(secure_1.default);
recentPrivateChatRouter.post("/add", recent_private_chat_controller_1.default.addRecentChat);
recentPrivateChatRouter.get("/", recent_private_chat_controller_1.default.getRecentChats);
exports.default = recentPrivateChatRouter;
//# sourceMappingURL=recentChats.router.js.map
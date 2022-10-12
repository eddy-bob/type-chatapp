"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const privateChat_controllers_1 = __importDefault(require("../controllers/privateChat.controllers"));
const privateChatRouter = (0, express_1.Router)();
const secure_1 = __importDefault(require("../middlewares/secure"));
privateChatRouter.use(secure_1.default);
privateChatRouter.delete("/delete/:chatId", privateChat_controllers_1.default.deleteChat);
privateChatRouter.get("/:friendId/get-chats", privateChat_controllers_1.default.getChats);
exports.default = privateChatRouter;
//# sourceMappingURL=chat.router.js.map
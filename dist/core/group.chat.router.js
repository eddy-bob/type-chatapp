"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const groupChat_controllers_1 = __importDefault(require("../controllers/groupChat.controllers"));
const groupChatRouter = (0, express_1.Router)();
const secure_1 = __importDefault(require("../middlewares/secure"));
groupChatRouter.use(secure_1.default);
groupChatRouter.delete("/delete", groupChat_controllers_1.default.deleteChat);
groupChatRouter.get("/:groupId", groupChat_controllers_1.default.getChats);
exports.default = groupChatRouter;
//# sourceMappingURL=group.chat.router.js.map
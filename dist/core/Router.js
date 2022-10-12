"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_router_1 = __importDefault(require("./auth.router"));
const group_router_1 = __importDefault(require("./group.router"));
const chat_router_1 = __importDefault(require("./chat.router"));
const group_chat_router_1 = __importDefault(require("./group.chat.router"));
const friend_router_1 = __importDefault(require("./friend.router"));
const user_router_1 = __importDefault(require("./user.router"));
const friendRequest_router_1 = __importDefault(require("./friendRequest.router"));
const recentChats_router_1 = __importDefault(require("./recentChats.router"));
const video_router_1 = __importDefault(require("./video.router"));
const useRouter = (0, express_1.Router)();
useRouter.use("/user/auth", auth_router_1.default);
useRouter.use("/group", group_router_1.default);
useRouter.use("/group/chat", group_chat_router_1.default);
useRouter.use("/user/private-chat", chat_router_1.default);
useRouter.use("/user/friend", friend_router_1.default);
useRouter.use("/user", user_router_1.default);
useRouter.use("/videoCall", video_router_1.default);
useRouter.use("/user/friend/request", friendRequest_router_1.default);
useRouter.use("/user/recent-private-chat", recentChats_router_1.default);
exports.default = useRouter;
//# sourceMappingURL=Router.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const friend_controllers_1 = __importDefault(require("../controllers/friend.controllers"));
const friendRouter = (0, express_1.Router)();
const secure_1 = __importDefault(require("../middlewares/secure"));
friendRouter.use(secure_1.default);
friendRouter.put("/:friendId/block", friend_controllers_1.default.blockFriend);
friendRouter.put("/:friendId/unblock", friend_controllers_1.default.unblockFriend);
friendRouter.get("/", friend_controllers_1.default.getFriends);
exports.default = friendRouter;
//# sourceMappingURL=friend.router.js.map
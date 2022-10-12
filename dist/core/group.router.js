"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const group_controllers_1 = __importDefault(require("../controllers/group.controllers"));
const group = (0, group_controllers_1.default)();
const groupRouter = (0, express_1.Router)();
const secure_1 = __importDefault(require("../middlewares/secure"));
groupRouter.use(secure_1.default);
groupRouter.post("/create", group.createGroup);
groupRouter.delete("/delete/:groupId", group.deleteGroup);
groupRouter.put("/update/:groupId", group.updateGroup);
groupRouter.put("/update-group-picture/:groupId", group.uploadGroupPhoto);
groupRouter.get("/fetch-groups", group.getGroups);
groupRouter.get("/get-group/:groupId", group.getGroup);
groupRouter.post("/send-invite/:groupId", group.sendGroupInvite);
groupRouter.get("/verify-invite/:inviteToken", group.verifyGroupInvite);
exports.default = groupRouter;
//# sourceMappingURL=group.router.js.map
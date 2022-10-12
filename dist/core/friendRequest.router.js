"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const friendRequest_controllers_1 = __importDefault(require("../controllers/friendRequest.controllers"));
const friendRequestRouter = (0, express_1.Router)();
const secure_1 = __importDefault(require("../middlewares/secure"));
friendRequestRouter.use(secure_1.default);
friendRequestRouter.post("/:id/send-request", friendRequest_controllers_1.default.sendRequest);
friendRequestRouter.get("/:requestId/accept-request", friendRequest_controllers_1.default.acceptRequest);
friendRequestRouter.delete("/:requestId/reject-request", friendRequest_controllers_1.default.rejectRequest);
friendRequestRouter.delete("/:requestId/delete-request", friendRequest_controllers_1.default.deleteRequest);
friendRequestRouter.get("/", friendRequest_controllers_1.default.getRequests);
exports.default = friendRequestRouter;
//# sourceMappingURL=friendRequest.router.js.map
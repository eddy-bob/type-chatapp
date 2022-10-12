"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const video_controller_1 = __importDefault(require("../controllers/video.controller"));
const friendRouter = (0, express_1.Router)();
const secure_1 = __importDefault(require("../middlewares/secure"));
friendRouter.use(secure_1.default);
friendRouter.get("/", video_controller_1.default.getVideoCalls);
exports.default = friendRouter;
//# sourceMappingURL=video.router.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controllers_1 = __importDefault(require("../controllers/auth.controllers"));
const authRouter = express_1.Router();
authRouter.post("/register", auth_controllers_1.default.register);
authRouter.post("/login", auth_controllers_1.default.login);
exports.default = authRouter;
//# sourceMappingURL=auth.router.js.map
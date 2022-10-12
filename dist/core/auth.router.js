"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controllers_1 = __importDefault(require("../controllers/auth.controllers"));
const authRouter = (0, express_1.Router)();
const secure_1 = __importDefault(require("../middlewares/secure"));
authRouter.post("/register", auth_controllers_1.default.register);
authRouter.post("/login", auth_controllers_1.default.login);
authRouter.get("/logout", auth_controllers_1.default.logout);
authRouter.put("/update-password", secure_1.default, auth_controllers_1.default.updatePassword);
authRouter.post("/forgot-password/init", auth_controllers_1.default.forgotPasswordInit);
authRouter.put("/:token/reset-password", auth_controllers_1.default.forgotPasswordComplete);
authRouter.get("/verify-email/init", secure_1.default, auth_controllers_1.default.verifyEmail);
authRouter.get(`/verify-email/:token/confirm`, secure_1.default, auth_controllers_1.default.checkVerifyEmailToken);
exports.default = authRouter;
//# sourceMappingURL=auth.router.js.map
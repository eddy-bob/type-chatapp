"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = __importDefault(require("../controllers/user.controllers"));
const userRouter = (0, express_1.Router)();
const secure_1 = __importDefault(require("../middlewares/secure"));
const authorize_1 = __importDefault(require("../middlewares/authorize"));
userRouter.use(secure_1.default);
userRouter.get("/users", (0, authorize_1.default)(["ADMIN"]), user_controllers_1.default.getUsers);
userRouter.get("/user-profile/:id", user_controllers_1.default.getUser);
userRouter.get("/profile", user_controllers_1.default.getProfile);
userRouter.get("/search-user", user_controllers_1.default.searchUser);
userRouter.delete("/delete-all", (0, authorize_1.default)(["ADMIN"]), user_controllers_1.default.deleteUsers);
userRouter.delete("/delete-user-account/:id", (0, authorize_1.default)(["ADMIN"]), user_controllers_1.default.deleteUser);
userRouter.delete("/delete-account", user_controllers_1.default.deleteAccount);
userRouter.put("/update-user/:id", (0, authorize_1.default)(["ADMIN"]), user_controllers_1.default.updateUser);
userRouter.put("/update-profile", user_controllers_1.default.updateProfile);
userRouter.put("/update-profile-picture", user_controllers_1.default.uploadProfilePicture);
userRouter.get("/search-user", user_controllers_1.default.searchUser);
userRouter.put("/update-cover-photo", user_controllers_1.default.uploadCoverPicture);
exports.default = userRouter;
//# sourceMappingURL=user.router.js.map
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Friend_1 = __importDefault(require("../entities/Friend"));
const customError_1 = require("../helpers/customError");
const success_response_1 = __importDefault(require("../helpers/success.response"));
const friend = {
    blockFriend: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { friendId } = req.params;
        const { userId } = req;
        try {
            const isFriend = yield Friend_1.default.findOne({
                friend: friendId,
                owner: userId,
            });
            if (!isFriend) {
                return next(new customError_1.customError("You are not friends with this person", 400));
            }
            if (isFriend.blocked == true) {
                return next(new customError_1.customError("You already blocked this person", 400));
            }
            const blockFriend = yield Friend_1.default.findByIdAndUpdate(isFriend._id, { $set: { blocked: true } }, { new: true, runValidators: true });
            (0, success_response_1.default)(res, blockFriend, 201, "user blocked successfully");
        }
        catch (err) {
            next(new customError_1.customError(err.message, 500));
        }
    }),
    unblockFriend: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { friendId } = req.params;
        const { userId } = req;
        try {
            const isFriend = yield Friend_1.default.findOne({
                friend: friendId,
                owner: userId,
            });
            if (!isFriend) {
                return next(new customError_1.customError("Request not found", 404));
            }
            if (isFriend.blocked == false) {
                return next(new customError_1.customError("You are still friends with this person", 400));
            }
            const blockFriend = yield Friend_1.default.findByIdAndUpdate(isFriend._id, { $set: { blocked: false } }, { new: true, runValidators: true });
            (0, success_response_1.default)(res, blockFriend, 201, "user unblocked successfully");
        }
        catch (err) {
            next(new customError_1.customError(err.message, 500));
        }
    }),
    getFriends: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req;
        try {
            const friends = yield Friend_1.default.find({ owner: userId, blocked: false });
            console.log("friends", friends);
            (0, success_response_1.default)(res, friends, 200, "Friends fetched successfully");
        }
        catch (err) {
            next(new customError_1.customError(err.message, 500));
        }
    }),
};
exports.default = friend;
//# sourceMappingURL=friend.controllers.js.map
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
const success_response_1 = __importDefault(require("../helpers/success.response"));
const customError_1 = require("../helpers/customError");
const FriendRequest_1 = __importDefault(require("../entities/FriendRequest"));
const User_1 = __importDefault(require("../entities/User"));
const Friend_1 = __importDefault(require("../entities/Friend"));
const friendRequest = {
    sendRequest: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { userId } = req;
        try {
            if (userId.toString() === id) {
                return next(new customError_1.customError("You cant send requests to yourself", 400));
            }
            const user = yield User_1.default.findById(id);
            const alreadySent = yield FriendRequest_1.default.findOne({
                reciever: id,
                PendingFriend: userId,
            });
            if (!user) {
                return next(new customError_1.customError("requested user does not exist or disabled by admin", 404));
            }
            if (alreadySent) {
                return next(new customError_1.customError("Request already sent", 400));
            }
            const newReq = yield FriendRequest_1.default.create({
                reciever: user._id,
                PendingFriend: userId,
            });
            yield newReq.save();
            console.log(newReq);
            (0, success_response_1.default)(res, newReq, 200, "Request sent succesfully");
        }
        catch (err) {
            next(new customError_1.customError(err.message, 500));
        }
    }),
    acceptRequest: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { requestId } = req.params;
        const { userId } = req;
        try {
            const isRequest = yield FriendRequest_1.default.findOne({
                _id: requestId,
                reciever: userId,
            });
            if (!isRequest) {
                return next(new customError_1.customError("request does not exist request does not exist", 404));
            }
            const isFriend = yield Friend_1.default.findOne({
                $or: [{
                        owner: userId,
                        friend: isRequest.PendingFriend,
                    }, {
                        friend: userId,
                        owner: isRequest.PendingFriend,
                    }]
            });
            if (isFriend) {
                console.log("already friends jare");
                yield FriendRequest_1.default.findByIdAndDelete(isRequest._id);
                return (0, success_response_1.default)(res, isFriend, 200, "You are already friends with this person");
            }
            const acceptFriend = yield Friend_1.default.create({
                owner: userId,
                friend: isRequest.PendingFriend,
            });
            yield acceptFriend.save();
            console.log("accept friend request ran");
            const addFriend = yield Friend_1.default.create({
                friend: userId,
                owner: isRequest.PendingFriend,
            });
            yield addFriend.save();
            console.log("Add friend ran too completing the circle");
            yield FriendRequest_1.default.findByIdAndDelete(isRequest._id);
            (0, success_response_1.default)(res, acceptFriend, 200, "Friend request accepted successfully");
        }
        catch (err) {
            next(new customError_1.customError(err.message, 500));
        }
    }),
    rejectRequest: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { requestId } = req.params;
        const { userId } = req;
        try {
            const isRequest = yield FriendRequest_1.default.findOne({
                _id: requestId,
                reciever: userId,
            });
            if (!isRequest) {
                return next(new customError_1.customError("request does not exist or you are not authorized", 404));
            }
            yield FriendRequest_1.default.findByIdAndDelete(isRequest._id);
            (0, success_response_1.default)(res, undefined, 200, "Friend request rejected successfully");
        }
        catch (err) {
            next(new customError_1.customError(err.message, 500));
        }
    }),
    deleteRequest: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { requestId } = req.params;
        const { userId } = req;
        try {
            const isRequest = yield FriendRequest_1.default.findById(requestId);
            if (!isRequest) {
                return next(new customError_1.customError("request does not exist", 404));
            }
            if (isRequest.PendingFriend.toString() === userId.toString()) {
                yield FriendRequest_1.default.findByIdAndDelete(isRequest._id);
                (0, success_response_1.default)(res, undefined, 200, "Sent request deleted successfully");
            }
            else {
                return next(new customError_1.customError("You are not authorized to delete this request", 403));
            }
        }
        catch (err) {
            next(new customError_1.customError(err.message, 500));
        }
    }),
    getRequests: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req;
        try {
            const requests = yield FriendRequest_1.default.find({ reciever: userId });
            (0, success_response_1.default)(res, requests, 200, "friend requests fetched successfully");
        }
        catch (err) {
            next(new customError_1.customError(err.message, 500));
        }
    }),
};
exports.default = friendRequest;
//# sourceMappingURL=friendRequest.controllers.js.map
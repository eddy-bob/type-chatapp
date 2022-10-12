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
const User_1 = __importDefault(require("../entities/User"));
const mongoose = require("mongoose");
const VideoCall_1 = __importDefault(require("../entities/VideoCall"));
const customError_1 = require("../helpers/customError");
const success_response_1 = __importDefault(require("../helpers/success.response"));
const video = {
    startVideoCall: (socket, io, userId, userFullName, id, socketReference, peerId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const isUser = yield User_1.default.findById(mongoose.Types.ObjectId(id));
            console.log(isUser);
            const isFriend = yield Friend_1.default.findOne({
                friend: mongoose.Types.ObjectId(userId),
                owner: mongoose.Types.ObjectId(id),
                blocked: false,
            });
            console.log(isFriend);
            if (!isUser) {
                return socket.emit("private_video_call_init_fail", {
                    message: "User does not exist or disabled",
                    statusCode: 404,
                });
            }
            if (!isFriend) {
                return socket.emit("private_video_call_init_fail", {
                    message: "You are not friends with this person",
                    statusCode: 401,
                });
            }
            console.log("it passed this place jare");
            const callRecord = yield VideoCall_1.default.create({
                caller: userId,
                callerName: userFullName,
                reciever: mongoose.Types.ObjectId(id),
            });
            console.log(callRecord);
            socket.emit("private_video_call_inverse_init", {
                callerId: userId,
                name: userFullName,
                peerId,
                callId: callRecord._id,
            });
            socket.to(socketReference).emit("private_video_call_init", {
                callerId: userId,
                name: userFullName,
                peerId,
                callId: callRecord._id,
            });
            // socket.emit("private_video_call_inverse_init", {
            //   recieverId: id,
            //   name: userFullName,
            // });
        }
        catch (err) {
            socket.emit("private_video_call_init_fail", {
                message: "Unable to process call",
            });
        }
    }),
    getVideoCalls: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req;
        try {
            const calls = yield VideoCall_1.default.find({
                $or: [{ caller: userId }, { reciever: userId }],
            });
            (0, success_response_1.default)(res, calls, 200, "Video calls fetched  successfully");
        }
        catch (err) {
            next(new customError_1.customError(err.message, err.statusCode || 500));
        }
    }),
    updateCallStatus: (socket, io, recieverId, callId, userFullName, userId, inverseReference, data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("it entered here", callId);
            let calls;
            calls = yield VideoCall_1.default.findById(mongoose.Types.ObjectId(callId));
            if (!calls) {
                socket.emit("private_video_call_action_error", {
                    statusCode: 404,
                    message: "Call record does not exist",
                });
            }
            if (!calls && data.callerId === userId) {
                socket.emit("private_video_call_end_success", {
                    message: "Call ended successfully",
                });
            }
            console.log(calls);
            if (data.status === "ENDED" || data.status === "MISSED") {
                console.log("endeddddddd");
                console.log(calls.caller, userId);
                if ((calls.reciever.equals(mongoose.Types.ObjectId(userId)) ||
                    calls.caller.equals(mongoose.Types.ObjectId(userId))) &&
                    data.status === "ENDED") {
                    console.log("got to end call check");
                    yield calls.updateOne({ status: data.status }, { new: true, validate: true });
                    console.log("got to end call");
                    if (calls.caller.equals(mongoose.Types.ObjectId(userId))) {
                        console.log("i am the caller trying to end the call");
                        socket.emit("private_video_call_end_success", {
                            message: "Call ended successfully",
                        });
                        socket
                            .to(inverseReference)
                            .emit("private_video_call_end_inverse_success", {
                            message: "Call ended successfully",
                        });
                    }
                    else {
                        console.log("i am the reciever trying to end the call");
                        socket.emit("private_video_call_end_success", {
                            message: "Call ended successfully",
                        });
                        socket
                            .to(data.socketReference)
                            .emit("private_video_call_end_inverse_success", {
                            message: "Call ended successfully",
                        });
                    }
                    if (calls.reciever.equals(mongoose.Types.ObjectId(recieverId))) {
                        socket.leave(data.callerId);
                    }
                }
                else {
                    socket.emit("private_video_call_action_error", {
                        statusCode: 403,
                        message: "Only a call reciever or caller can end call",
                    });
                }
            }
            else if (calls.reciever.equals(mongoose.Types.ObjectId(recieverId))) {
                console.log("reciver gat this");
                yield calls.updateOne({ status: data.status }, { validate: true });
                if (data.status === "ACCEPTED") {
                    console.log("accept region");
                    socket.join(data.callerId);
                    socket.emit("private_video_call_authorize", {
                        callerId: data.callerId,
                        name: data.callerName,
                        peerId: data.peerId,
                        callId,
                    });
                    socket
                        .to(data.socketReference)
                        .emit("private_video_call_inverse_authorize", {
                        callerId: data.callerId,
                        name: data.callerName,
                        peerId: data.peerId,
                        callId,
                    });
                    // socket.broadcast
                    //   .to(data.callerId)
                    //   .emit("private_video_call_authorized", {
                    //     recieverId: userId,
                    //     name: userFullName,
                    //   });
                }
                else {
                    socket.emit("private_video_call_reject_success", {
                        callerId: data.callerId,
                        name: data.callerName,
                        message: "Call rejected successfully",
                    });
                    socket
                        .to(data.socketReference)
                        .emit("private_video_call_reciever_rejected", {
                        recieverId: recieverId,
                        name: userFullName,
                        message: "reciever rejected call",
                    });
                }
            }
            else {
                socket.emit("private_video_call_action_error", {
                    statusCode: 403,
                    message: "Only a call reciever can reject or accept a call",
                });
            }
            socket.to(data.socketReference).emit("private_video_call_missed_notify", {
                message: `Video call not answered`,
            });
            socket.emit("private_video_call_not_answered", {
                message: `Video call ${data.status.toLowerCase()}`,
            });
        }
        catch (err) {
            socket.emit("private_video_call_action_error", {
                statusCode: err.statusCode || 500,
                message: err.message || "Couldnt carry out video call action",
            });
        }
    }),
};
exports.default = video;
//# sourceMappingURL=video.controller.js.map
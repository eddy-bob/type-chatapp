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
const PrivateMessages_1 = __importDefault(require("../entities/PrivateMessages"));
const Friend_1 = __importDefault(require("../entities/Friend"));
const mongoose = require("mongoose");
const customError_1 = require("../helpers/customError");
const formatMessage_1 = require("../utils/formatMessage");
const success_response_1 = __importDefault(require("../helpers/success.response"));
const Groups_1 = __importDefault(require("../entities/Groups"));
const GroupMessages_1 = __importDefault(require("../entities/GroupMessages"));
const User_1 = __importDefault(require("../entities/User"));
const Friend_2 = __importDefault(require("../entities/Friend"));
const privateChat = {
    forwardMessage: (data, socket, userId, userData, userFullName, io) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const isMessage = yield PrivateMessages_1.default.findOne(data.messageId);
            if (!isMessage) {
                return socket.emit("forwardfail", {
                    statusCode: 400,
                    message: `message to forward doesnt exist or deleted`,
                });
            }
            data.recipients.forEach((recipient) => __awaiter(void 0, void 0, void 0, function* () {
                const isGroup = yield Groups_1.default.findOne({
                    _id: recipient.id,
                    members: { $in: [userId] },
                });
                const isUser = yield User_1.default.findById(recipient.id);
                if (isGroup) {
                    const isSent = yield GroupMessages_1.default.create({
                        owner: userId,
                        message: isMessage.message,
                        group: recipient,
                        forwarded: true,
                    });
                    if (isSent) {
                        io.in(isGroup.name).emit("newGroupMessage", (0, formatMessage_1.format)(userFullName, isMessage.message));
                    }
                    else {
                        return socket.emit("forwardfail", {
                            statusCode: 500,
                            message: `group message forward to ${isGroup.name} failed`,
                        });
                    }
                }
                else if (isUser) {
                    const isFriend = yield Friend_2.default.findOne({
                        owner: recipient.id,
                        friend: userId,
                        blocked: false,
                    });
                    if (!isFriend) {
                        return socket.emit("forwardfail", {
                            statusCode: 401,
                            message: `private message forward to isUser.firstName} ${isUser.lastName} failed because you are not friends with the requested user`,
                        });
                    }
                    const sent = yield PrivateMessages_1.default.create({
                        sender: userId,
                        reciever: recipient.id,
                        message: isMessage.message,
                        forwarded: true,
                    });
                    if (sent) {
                        io.to(recipient.clientId).emit("newMessage", (0, formatMessage_1.format)({ name: userFullName, id: socket.id }, isGroup.message));
                    }
                    else {
                        return socket.emit("forwardfail", {
                            statusCode: 500,
                            message: `private message forward to ${isUser.firstName} ${isUser.lastName} failed`,
                        });
                    }
                }
            }));
        }
        catch (err) {
            return socket.emit("forwardFail", {
                message: err.message,
                statusCode: 500,
            });
        }
    }),
    addChat: (socket, data, userId, io, userFullName, con) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // const isRelationship = await Friend.findById(
            //   mongoose.Types.ObjectId(data.relationshipId)
            // );
            // console.log("isRelationship:", isRelationship, data.relationshipId);
            const isFriend = yield Friend_1.default.findOne({
                friend: mongoose.Types.ObjectId(userId),
                owner: mongoose.Types.ObjectId(data.userId),
                blocked: false,
            });
            console.log(isFriend);
            // if (!isRelationship) {
            //   return socket.emit("chatError", {
            //     message: "You are not friends with this person",
            //     statusCode: 403,
            //   });
            // }
            if (!isFriend) {
                return socket.emit("chatError", {
                    message: "You are not friends with this person",
                    statusCode: 403,
                });
            }
            if (isFriend && isFriend.blocked == true) {
                return socket.emit("chatError", {
                    message: "You blocked this user",
                    statusCode: 401,
                });
            }
            const newMessage = yield PrivateMessages_1.default.create({
                message: data.message,
                senderName: userFullName,
                attatchment: data.attatchment,
                sender: userId,
                reciever: data.userId,
            });
            if (!newMessage) {
                return socket.emit("chatError", {
                    message: "could not send message",
                    statuseCode: 500,
                });
            }
            console.log(newMessage);
            socket.emit("myMessage", (0, formatMessage_1.format)({
                chatId: newMessage._id,
                senderName: userFullName,
                sender: userId,
                attatchment: data.attatchment,
                status: "DELIEVERED",
            }, data.message));
            socket.to(con[[data.userId]]).emit("newMessage", (0, formatMessage_1.format)({
                chatId: newMessage._id,
                senderName: userFullName,
                sender: userId,
                attatchment: data.attatchment,
            }, data.message));
            socket.on("read", (data) => { });
        }
        catch (err) {
            socket.emit("ChatError", { message: err.message, statusCode: 500 });
        }
    }),
    getChats: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { friendId } = req.params;
        const { userId, userRole } = req;
        try {
            // const isFriend = await Friend.findOne({
            //        owner: friendId,
            //        friend: userId,
            //        blocked: false
            // })
            // console.log(isFriend)
            // if (!isFriend && userRole !== "ADMIN") { return next(new customError("you are not friends with this person", 403)) }
            const chats = yield PrivateMessages_1.default.find({
                $or: [
                    { sender: friendId, reciever: userId },
                    { sender: userId, reciever: friendId },
                ],
                hideFrom: { $ne: userId },
            });
            (0, success_response_1.default)(res, chats, 200, "Chats fetched succesfully");
        }
        catch (err) {
            next(new customError_1.customError(err.message, 500));
        }
    }),
    readChat: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield PrivateMessages_1.default.populate();
        }
        catch (err) {
            //        socket.emit("ChatError",
            //               { message: err.message, statusCode: 500 })
            // }
        }
    }),
    deleteChat: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { chatId } = req.params;
        const { userId, userRole } = req;
        try {
            const isChat = yield PrivateMessages_1.default.findById(chatId);
            if (!isChat) {
                return next(new customError_1.customError("Chat doesnt exist", 404));
            }
            if (userRole === "ADMIN" || isChat.sender.toString() === userId) {
                yield PrivateMessages_1.default.findByIdAndDelete(chatId);
            }
            else {
                PrivateMessages_1.default.findByIdAndUpdate(chatId, { $set: { hideFrom: userId } });
            }
            (0, success_response_1.default)(res, undefined, 201, "message deleted successfully");
        }
        catch (err) {
            next(new customError_1.customError(err.message, 500));
        }
    }),
};
exports.default = privateChat;
//# sourceMappingURL=privateChat.controllers.js.map
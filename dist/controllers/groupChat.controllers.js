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
const GroupMessages_1 = __importDefault(require("../entities/GroupMessages"));
const Groups_1 = __importDefault(require("../entities/Groups"));
const User_1 = __importDefault(require("../entities/User"));
const formatMessage_1 = require("../utils/formatMessage");
const PrivateMessages_1 = __importDefault(require("../entities/PrivateMessages"));
const Friend_1 = __importDefault(require("../entities/Friend"));
const groupChat = {
    forwardMessage: (data, socket, userId, userData, userFullName, io) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const isMessage = yield GroupMessages_1.default.findOne(data.messageId);
            if (!isMessage) {
                return socket.emit("forwardfail", { statusCode: 400, message: `message to forward doesnt exist or deleted` });
            }
            data.recipients.forEach((recipient) => __awaiter(void 0, void 0, void 0, function* () {
                const isGroup = yield Groups_1.default.findOne({ _id: recipient.id, members: { $in: [userId] } });
                const isUser = yield User_1.default.findById(recipient.id);
                if (isGroup) {
                    const isSent = yield GroupMessages_1.default.create({
                        owner: userId, message: isMessage.message,
                        group: recipient, forwarded: true
                    });
                    if (isSent) {
                        io.in(isGroup.name).emit("newGroupMessage", (0, formatMessage_1.format)(userFullName, isMessage.message));
                    }
                    else {
                        return socket.emit("forwardfail", { statusCode: 500, message: `group message forward to ${isGroup.name} failed` });
                    }
                }
                else if (isUser) {
                    const isFriend = yield Friend_1.default.findOne({ owner: recipient.id, friend: userId, blocked: false });
                    if (!isFriend) {
                        return socket.emit("forwardfail", {
                            statusCode: 401, message: `private message forward to isUser.firstName} ${isUser.lastName} failed because you are not friends with the requested user`
                        });
                    }
                    const sent = yield PrivateMessages_1.default.create({ sender: userId, reciever: recipient.id, message: isMessage.message, forwarded: true });
                    if (sent) {
                        io.to(recipient.clientId).emit("newMessage", (0, formatMessage_1.format)({ name: userFullName, id: socket.id }, isGroup.message));
                    }
                    else {
                        return socket.emit("forwardfail", { statusCode: 500, message: `private message forward to ${isUser.firstName} ${isUser.lastName} failed` });
                    }
                }
            }));
        }
        catch (err) {
            return socket.emit("forwardFail", { message: err.message, statusCode: 500 });
        }
    }),
    addChat: (socket, data, userId, userData, io, userFullName) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const isGroup = yield Groups_1.default.findById(data.groupId);
            if (!isGroup) {
                return socket.emit("groupChatError", { message: "Group does not exist or disabled by admin", statusCode: 404 });
            }
            const isMember = isGroup.members.includes(userId);
            if (isMember == true || userData.role === "ADMIN") {
                const newChat = yield GroupMessages_1.default.create({
                    group: data.groupId,
                    sender: userId,
                    message: data.message,
                    attatchment: data.attatchment,
                    senderName: userFullName
                });
                yield newChat.save();
                io.in(isGroup.name).emit("newGroupMessage", (0, formatMessage_1.format)(userFullName, data.message));
            }
            else {
                return socket.emit("groupChatError", { message: "You are not a member of this group", statusCode: 401 });
            }
        }
        catch (err) {
            socket.emit("groupChatError", { message: err.message, statusCode: 500 });
        }
    }),
    deleteChat: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { chatId, groupId } = req.query;
        const { userId, userRole } = req;
        try {
            const isGroup = yield Groups_1.default.findById(groupId);
            const isChat = yield GroupMessages_1.default.findById(chatId);
            if (!isGroup) {
                return next(new customError_1.customError("Group doesnt exist or disabled by admin", 404));
            }
            if (!isChat) {
                return next(new customError_1.customError("Chat doesnt exist", 404));
            }
            const isMember = isGroup.members.includes(userId);
            if (isMember == true || userRole === "ADMIN") {
                if (userRole === "ADMIN" || isGroup.admin.toString() === userId || isGroup.moderators.includes(userId) || isChat.sender.toString() === userId) {
                    yield GroupMessages_1.default.findByIdAndDelete(chatId);
                }
                else {
                    yield GroupMessages_1.default.findByIdAndUpdate(chatId, { $set: { $push: { hideFrom: userId } } });
                }
                (0, success_response_1.default)(res, undefined, 201, "Chat deleted successfully");
            }
            else {
                return next(new customError_1.customError("You must belong to this group to be able to delete a message"));
            }
        }
        catch (err) {
            return next(new customError_1.customError(err.message, 500));
        }
    }),
    getChats: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { groupId } = req.params;
        const { userId, userRole } = req;
        try {
            const isGroup = yield Groups_1.default.findById(groupId);
            if (!isGroup) {
                return next(new customError_1.customError("Group doesnt exist or disabled by admin", 404));
            }
            const isMember = isGroup.members.includes(userId);
            if (isMember == true || userRole === "ADMIN") {
                const groupChats = yield GroupMessages_1.default.find({ group: groupId, hideFrom: { $nin: [userId] } });
                (0, success_response_1.default)(res, groupChats, 200, "chats fetched successfully");
            }
            else {
                return next(new customError_1.customError("You must belong to this group to be able to join group"));
            }
        }
        catch (err) {
            return next(new customError_1.customError(err.message, 500));
        }
    }),
};
exports.default = groupChat;
//# sourceMappingURL=groupChat.controllers.js.map
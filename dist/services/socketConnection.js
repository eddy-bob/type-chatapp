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
exports.socketCon = void 0;
const formatMessage_1 = require("../utils/formatMessage");
const group_controllers_1 = __importDefault(require("../controllers/group.controllers"));
const User_1 = __importDefault(require("../entities/User"));
const groupChat_controllers_1 = __importDefault(require("../controllers/groupChat.controllers"));
const Groups_1 = __importDefault(require("../entities/Groups"));
const privateChat_controllers_1 = __importDefault(require("../controllers/privateChat.controllers"));
const socket_auth_1 = __importDefault(require("../utils/socket-auth"));
const video_controller_1 = __importDefault(require("../controllers/video.controller"));
const socketCon = {
    socketConnection: (io) => {
        // const setDetails = async (response: any) => {
        //        userData = await User.findById(response.id)
        //        userId = userData._id as ObjectId;
        //        userFullName = userData.firstName + " " + userData.lastName
        //        return [userId, userFullName]
        // }
        var con = {};
        const userDet = {};
        var userData;
        var userId;
        var userFullName;
        const groupMethod = (0, group_controllers_1.default)();
        io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
            let token = socket.handshake.headers.authorization;
            socket.on("forceDisconnnect", () => {
                socket.disconnect();
                console.log("disconnected");
            });
            // if there is no auth header,disconnect connected socket
            if (!token) {
                socket.emit("noAuthDisconect", {
                    statusCode: 401,
                    message: "Unauthorized",
                });
            }
            if (token) {
                const response = (0, socket_auth_1.default)(token);
                if (!response.id) {
                    socket.emit("noAuthDisconect", {
                        statusCode: 401,
                        message: "Unauthorized",
                    });
                }
                else {
                    userData = yield User_1.default.findById(response.id);
                    userId = userData._id;
                    userFullName = userData.firstName + " " + userData.lastName;
                    if (userId) {
                        con[userId] = socket.id;
                        console.log(con, userFullName);
                        userDet[userId] = userFullName;
                        console.log(" socket connected");
                        // rejoin all groups
                        // join private group
                        socket.join(userId);
                        const groups = yield Groups_1.default.find({ members: { $in: [userId] } });
                        if (groups[0]) {
                            groups.forEach((group) => {
                                socket.join(group.name);
                            });
                        }
                        // send welcome message to the user that just  the group chat
                        socket.on("privateMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
                            let token = socket.handshake.headers.authorization;
                            const response = (0, socket_auth_1.default)(token);
                            // recompute the user's data
                            privateChat_controllers_1.default.addChat(socket, data, response.id, io, userDet[[response.id]], con);
                            console.log(data);
                            console.log("recieverId==", userDet[[data.userId]]);
                        }));
                        // send a notification  that a user started typing
                        socket.on("typing", (data) => {
                            socket
                                .to(con[[data.recipient]])
                                .emit("typing", { value: data.value });
                        });
                        socket.on("joinGroup", (data) => {
                            groupMethod.joinGroup(data, socket, userId, userData, userFullName);
                        });
                        socket.on("leaveGroup", (data) => {
                            groupMethod.leaveGroup(data, socket, userId, userData, userFullName);
                        });
                        // notify all the users that a user just left the chat
                        socket.on("groupMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
                            console.log("fired", data);
                            let token = socket.handshake.headers.authorization;
                            const response = (0, socket_auth_1.default)(token);
                            userData = yield User_1.default.findById(response.id);
                            // recompute the user's data
                            console.log(userDet[[response.id]]);
                            groupChat_controllers_1.default.addChat(socket, data, response.id, userData, io, userDet[[response.id]]);
                        }));
                        socket.on("groupForward", (data) => __awaiter(void 0, void 0, void 0, function* () {
                            console.log("fired", data);
                            let token = socket.handshake.headers.authorization;
                            const response = (0, socket_auth_1.default)(token);
                            userData = yield User_1.default.findById(response.id);
                            groupChat_controllers_1.default.forwardMessage(data, socket, response.id, userData, userFullName, io);
                        }));
                        socket.on("privateForward", (data) => __awaiter(void 0, void 0, void 0, function* () {
                            let token = socket.handshake.headers.authorization;
                            const response = (0, socket_auth_1.default)(token);
                            userData = yield User_1.default.findById(response.id);
                            privateChat_controllers_1.default.forwardMessage(data, socket, response.id, userData, userDet[[response.id]], io);
                        })),
                            socket.on("private_call_init", () => __awaiter(void 0, void 0, void 0, function* () { }));
                        socket.on("private_call_answer", () => __awaiter(void 0, void 0, void 0, function* () { }));
                        socket.on("private_call_reject", () => __awaiter(void 0, void 0, void 0, function* () { }));
                        socket.on("private_call_end", () => __awaiter(void 0, void 0, void 0, function* () { }));
                        socket.on("private_video_call_init", (data) => __awaiter(void 0, void 0, void 0, function* () {
                            console.log("private call started");
                            const socketReference = con[[data.userId]];
                            console.log(socketReference);
                            console.log(userDet[[data.userId]]);
                            let token = socket.handshake.headers.authorization;
                            const response = (0, socket_auth_1.default)(token);
                            yield video_controller_1.default.startVideoCall(socket, io, response.id, userFullName, data.userId, socketReference, data.peerId);
                        }));
                        socket.on("private_video_call_answer", (data) => __awaiter(void 0, void 0, void 0, function* () {
                            console.log("answer fired");
                            console.log(data);
                            let token = socket.handshake.headers.authorization;
                            const response = (0, socket_auth_1.default)(token);
                            const socketReference = con[[data.callerId]];
                            const inverseReference = con[[data.recieverId]];
                            yield video_controller_1.default.updateCallStatus(socket, io, data.recieverId, data.callId, userFullName, response.id, inverseReference, {
                                status: "ACCEPTED",
                                callerId: data.callerId,
                                socketReference,
                                callerName: userDet[[data.callerId]],
                                peerId: data.peerId,
                            });
                        }));
                        socket.on("private_video_call_reject", (data) => __awaiter(void 0, void 0, void 0, function* () {
                            const socketReference = con[[data.callerId]];
                            const inverseReference = con[[data.recieverId]];
                            let token = socket.handshake.headers.authorization;
                            const response = (0, socket_auth_1.default)(token);
                            yield video_controller_1.default.updateCallStatus(socket, io, data.recieverId, data.callId, userFullName, response.id, inverseReference, {
                                status: "REJECTED",
                                callerId: data.callerId,
                                socketReference,
                                callerName: userDet[[data.callerId]],
                                peerId: data.peerId,
                            });
                        }));
                        socket.on("private_video_call_end", (data) => __awaiter(void 0, void 0, void 0, function* () {
                            console.log("end call hit");
                            let token = socket.handshake.headers.authorization;
                            const response = (0, socket_auth_1.default)(token);
                            console.log(response.id);
                            const socketReference = con[[data.callerId]];
                            const inverseReference = con[[data.recieverId]];
                            yield video_controller_1.default.updateCallStatus(socket, io, data.recieverId, data.callId, userFullName, response.id, inverseReference, {
                                status: "ENDED",
                                callerId: data.callerId,
                                socketReference,
                                callerName: userDet[[data.callerId]],
                                peerId: data.peerId,
                            });
                        }));
                        socket.on("disconnect", () => {
                            console.log("disconnected");
                            io.emit("loggedOut", (0, formatMessage_1.format)(userFullName, "went offline"));
                        });
                    }
                }
            }
        }));
    },
};
exports.socketCon = socketCon;
//# sourceMappingURL=socketConnection.js.map
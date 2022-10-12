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
const Groups_1 = __importDefault(require("../entities/Groups"));
const formatMessage_1 = require("../utils/formatMessage");
const groupInvite_1 = __importDefault(require("../entities/groupInvite"));
const endpoints_config_1 = __importDefault(require("../config/endpoints.config"));
const nodemailer_1 = __importDefault(require("../services/nodemailer"));
const GroupMessages_1 = __importDefault(require("../entities/GroupMessages"));
const User_1 = __importDefault(require("../entities/User"));
const uploadPhoto_1 = __importDefault(require("../utils/uploadPhoto"));
const groupFunc = () => {
    return {
        createGroup: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            const { name, description, members } = req.body;
            const failedMail = [];
            const { userId } = req;
            try {
                console.log(members);
                const newGroup = yield Groups_1.default.create({ name, description, admin: userId, members: [userId] });
                if (newGroup) {
                    members.forEach((invite) => __awaiter(void 0, void 0, void 0, function* () {
                        let mem = yield User_1.default.findById(invite);
                        if (!mem) {
                            failedMail.push(mem);
                        }
                        else {
                            const singleInvite = yield groupInvite_1.default.create({ group: newGroup._id, invitee: invite });
                            const inviteToken = yield singleInvite.getToken();
                            yield groupInvite_1.default.findByIdAndUpdate(singleInvite._id, { inviteToken, expires: new Date(Date.now()) }, { runValidators: true, new: true });
                            const url = `${req.protocol}://${endpoints_config_1.default.baseUrl}/group-chat/${inviteToken}`;
                            yield (0, nodemailer_1.default)(mem.email, endpoints_config_1.default.contactAddress, `You have been invited to collaborate in  ${newGroup.name}
                                          kindly click on  'accept invite' below to get started`, "Group Invite", url, "accept invite");
                        }
                    }));
                    // send invite mail
                    // members.forEach(async (member: string) => {
                    //        let mem = await User.findById(member)
                    //        if (!mem) { failedMail.push(mem) } else {
                    //               await nodemailer(mem.email, endPoint.contactAddress, "Group Invite", `You have been invited to collaborate in  ${newGroup.name}
                    //        kindly click on  'accept invite' below to get started`, url, "accept invite")
                    //        }
                    // });
                }
                yield newGroup.save();
                if (failedMail[0]) {
                    res.status(200).send({ data: newGroup, failedInvite: failedMail, message: "Group created successfully but couldnt send invite to all requested users because they not exist " });
                }
                else {
                    (0, success_response_1.default)(res, newGroup, 200, "Group created successfully");
                }
            }
            catch (err) {
                return next(new customError_1.customError(err.message, 500));
            }
        }),
        updateGroup: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            const { groupId } = req.params;
            const { name, description } = req.body;
            const { userId, userRole } = req;
            try {
                const isGroup = yield Groups_1.default.findById(groupId);
                if (!isGroup) {
                    return next(new customError_1.customError("Group doesnt exist or disabled by admin", 404));
                }
                if (userRole === "ADMIN" || isGroup.admin.toString() === userId || isGroup.moderators.includes(userId)) {
                    const newGroup = yield Groups_1.default.findByIdAndUpdate(groupId, {
                        $set: {
                            name, description
                        }
                    }, { runValidators: true, new: true });
                    yield newGroup.save();
                    (0, success_response_1.default)(res, newGroup, 200, "Group updated successfully");
                }
                else {
                    return next(new customError_1.customError("only moderators and  administrators may update this group"));
                }
            }
            catch (err) {
                return next(new customError_1.customError(err.message, 500));
            }
        }),
        uploadGroupPhoto: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            const { userId, userRole } = req;
            const { photo } = req.body;
            const { groupId } = req.params;
            try {
                const isGroup = yield Groups_1.default.findById(groupId);
                if (!isGroup) {
                    return next(new customError_1.customError("Group doesnt exist or disabled by admin", 404));
                }
                if (userRole === "ADMIN" || isGroup.admin.toString() === userId.toString() || isGroup.moderators.includes(userId)) {
                    // upload image to cloudinary
                    if (!photo) {
                        return next(new customError_1.customError("Group photo is required", 400));
                    }
                    const image = yield (0, uploadPhoto_1.default)(photo);
                    const updateGroup = yield Groups_1.default.findByIdAndUpdate(groupId, {
                        $set: {
                            photo: {
                                name: image.name,
                                mimeType: image.type,
                                size: image.size,
                                url: image.url
                            },
                        }
                    });
                    (0, success_response_1.default)(res, updateGroup, 200, "Group photo updated Successfully");
                }
                else {
                    return next(new customError_1.customError("only moderators and  administrators may update this group"));
                }
            }
            catch (err) {
                return next(new customError_1.customError(err.message, 500));
            }
        }),
        deleteGroup: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            const { groupId } = req.params;
            const { userId, userRole } = req;
            try {
                const isGroup = yield Groups_1.default.findById(groupId);
                if (!isGroup) {
                    return next(new customError_1.customError("Group doesnt exist or disabled by admin", 404));
                }
                if (userRole === "ADMIN" || isGroup.admin.toString() === userId) {
                    const isGroup = yield Groups_1.default.findByIdAndDelete(groupId);
                    // if (isGroup) {
                    //        socket.leave(isGroup.name)
                    //        socket.emit("leaveGroup", "You have successfully left " + isGroup.name)
                    //        socket.broadcast.to(isGroup.name).emit("groupLeaveSuccess", format(`${userData.firstName} ${userData.lastName}`, " group"))
                    // }
                    (0, success_response_1.default)(res, undefined, 200, "Group deleted successfully");
                }
                else {
                    return next(new customError_1.customError("only administrators may delete this group"));
                }
            }
            catch (err) {
                return next(new customError_1.customError(err.message, 500));
            }
        }),
        getGroup: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            const { userId } = req;
            const { groupId } = req.params;
            try {
                const isGroup = yield Groups_1.default.findOne({ _id: groupId, members: { $in: [userId] } });
                if (!isGroup) {
                    return next(new customError_1.customError("Group doesnt exist or disabled by admin", 404));
                }
                (0, success_response_1.default)(res, isGroup, 200, "Group fetched successfully");
            }
            catch (err) {
                return next(new customError_1.customError(err.message, 500));
            }
        }),
        getGroups: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { userId, userRole } = req;
                const groups = yield Groups_1.default.find({ members: { $in: [userId] } }).sort({ name: 1 });
                (0, success_response_1.default)(res, groups, 200, "Groups fetched successfully");
            }
            catch (err) {
                return next(new customError_1.customError(err.message, 500));
            }
        }),
        sendGroupInvite: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            const { groupId } = req.params;
            const { invitees } = req.body;
            const { userData, userId } = req;
            try {
                const isGroup = yield Groups_1.default.findById(groupId);
                const isModerator = yield Groups_1.default.findOne({ _id: groupId, moderators: { $in: [userId] } });
                if (!isGroup) {
                    return next(new customError_1.customError("Group doesnt exist or disabled by admin"));
                }
                if (isModerator || isGroup.admin.toString() === userId.toString()) {
                    invitees.forEach((invite) => __awaiter(void 0, void 0, void 0, function* () {
                        const singleInvite = yield groupInvite_1.default.create({ group: isGroup._id, invitee: invite });
                        const inviteToken = yield singleInvite.getToken();
                        yield singleInvite.findByIdAndUpdate(singleInvite._id, { inviteToken, expires: new Date(Date.now()) }, { runValidators: true, new: true });
                        const url = `${req.protocol}://${endpoints_config_1.default.baseUrl}/group-home/${inviteToken}`;
                        // send invite mail
                        yield (0, nodemailer_1.default)(userData.email, endpoints_config_1.default.contactAddress, `You have been invited to collaborate in  ${isGroup.name}
                                   kindly click on  'accept invite' below to get started`, "Group Invite", url, "accept invite");
                    }));
                    (0, success_response_1.default)(res, undefined, 200, "Groups invite sent  successfully to user email");
                }
                else {
                    return next(new customError_1.customError("Only admins or moderators can send out group invite", 403));
                }
            }
            catch (err) {
                return next(new customError_1.customError(err.message, 500));
            }
        }),
        verifyGroupInvite: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            const { userId } = req;
            const { inviteToken } = req.params;
            try {
                const isInvited = yield groupInvite_1.default.findOne({
                    invitee: userId,
                    inviteToken: inviteToken,
                    $gte: { expires: new Date(Date.now()) }
                });
                if (!isInvited) {
                    return next(new customError_1.customError("Invite token expired or does not exist", 403));
                }
                else {
                    yield groupInvite_1.default.findByIdAndDelete(isInvited._id);
                    (0, success_response_1.default)(res, undefined, 200, "Group invite verified successfully");
                }
            }
            catch (err) {
                return next(new customError_1.customError(err.message, 500));
            }
        }),
        joinGroup: (data, socket, userId, userData, userFullName) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const isGroup = yield Groups_1.default.findById(data.groupId);
                if (!isGroup) {
                    return socket.emit("groupError", { message: "Group does not exist or disabled by admin", statusCode: 404 });
                }
                if (isGroup.members.includes(userId)) {
                    return socket.emit("groupError", { message: "You are already in this group", statusCode: 400 });
                }
                const updatedGroup = yield Groups_1.default.findByIdAndUpdate(data.groupId, { $push: { members: userId } }, { new: true, runValidators: true });
                if (updatedGroup) {
                    socket.join(isGroup.name);
                    // send notification to group and persist
                    yield GroupMessages_1.default.insertMany([{
                            $push: { hideFrom: userId },
                            group: data.groupId,
                            message: `${userFullName} joined group`
                        }, {
                            $pushAll: {
                                hideFrom: [{ 'isGroup.$.members': { $nin: [userId] } }]
                            },
                            group: data.groupId,
                            message: ``
                        }]);
                    socket.emit("joinGroupSuccess", (0, formatMessage_1.format)(isGroup.name + "Bot", "Welcome to " + isGroup.name));
                    socket.in(isGroup.name).emit("groupJoin", (0, formatMessage_1.format)(`${userData.firstName} ${userData.lastName}`, "joined group"));
                }
            }
            catch (err) {
                return socket.emit("groupError", { message: err.message, statusCode: 500 });
            }
        }),
        leaveGroup: (data, socket, userId, userData, userFullName) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const isGroup = yield Groups_1.default.findOne({ _id: data.groupId, members: { $in: [userId] } });
                if (!isGroup) {
                    return socket.emit("groupError", { message: "Group doesnt exist or disabled by admin", statusCode: 404 });
                }
                yield Groups_1.default.findByIdAndUpdate(data.groupId, { $pull: { members: userId } }, { new: true, runValidators: true });
                socket.leave(isGroup.name);
                // send notification to group and persist
                yield GroupMessages_1.default.create({
                    group: data.groupId,
                    message: `${userFullName} left group`
                });
                socket.emit("leaveGroupSuccess", { message: "You left" + isGroup.name, statusCode: 200 });
                socket.broadcast.to(isGroup.name).emit("groupLeave", (0, formatMessage_1.format)(`${userData.firstName} ${userData.lastName}`, "joined group"));
            }
            catch (err) {
                socket.emit("groupError", { message: err.message, statusCode: 500 });
            }
        }),
    };
};
exports.default = groupFunc;
//# sourceMappingURL=group.controllers.js.map
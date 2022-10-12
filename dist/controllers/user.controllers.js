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
const User_1 = __importDefault(require("../entities/User"));
const uploadPhoto_1 = __importDefault(require("../utils/uploadPhoto"));
const user = {
    getUsers: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const allUsers = yield User_1.default.find({});
            (0, success_response_1.default)(res, allUsers, 200, "All Users Fetched Successfully");
        }
        catch (err) {
            return next(new customError_1.customError(err.message, 500));
        }
    }),
    uploadProfilePicture: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req;
        try {
            const { photo } = req.body;
            // upload image to cloudinary
            if (!photo) {
                return next(new customError_1.customError("Profile picture is required", 400));
            }
            const image = yield (0, uploadPhoto_1.default)(photo);
            const updateProfile = yield User_1.default.findByIdAndUpdate(userId, {
                $set: {
                    photo: {
                        mimeType: image.format,
                        size: image.bytes,
                        url: image.secure_url
                    },
                }
            }, { new: true, runValidators: true });
            console.log(updateProfile);
            (0, success_response_1.default)(res, updateProfile, 200, "Profile picture updated Successfully");
        }
        catch (err) {
            return next(new customError_1.customError(err.message, 500));
        }
    }),
    uploadCoverPicture: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req;
        try {
            const { coverPhoto } = req.body;
            // upload image to cloudinary
            if (!coverPhoto) {
                return next(new customError_1.customError("cover photo is required", 400));
            }
            const image = yield (0, uploadPhoto_1.default)(coverPhoto);
            const updateProfile = yield User_1.default.findByIdAndUpdate(userId, {
                $set: {
                    coverPhoto: {
                        mimeType: image.format,
                        size: image.bytes,
                        url: image.secure_url
                    },
                }
            }, { new: true, runValidators: true });
            (0, success_response_1.default)(res, updateProfile, 200, "Cover photo updated Successfully");
        }
        catch (err) {
            return next(new customError_1.customError(err.message, 500));
        }
    }),
    deleteUsers: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const allUsers = yield User_1.default.deleteMany({});
            (0, success_response_1.default)(res, undefined, 200, "All Users Deleted Successfully");
        }
        catch (err) {
            return next(new customError_1.customError(err.message, 500));
        }
    }),
    getProfile: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req;
        try {
            const user = yield User_1.default.findById(userId);
            if (user) {
                (0, success_response_1.default)(res, user, 200, "Profile Fetched Successfully");
            }
            else {
                return next(new customError_1.customError("Profile not found or disabled", 404));
            }
        }
        catch (err) {
            return next(new customError_1.customError(err.message, 500));
        }
    }),
    getUser: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const user = yield User_1.default.findById(id);
            console.log(user);
            if (user) {
                (0, success_response_1.default)(res, user, 200, "User Fetched Successfully");
            }
            else {
                return next(new customError_1.customError("User not found or disabled", 404));
            }
        }
        catch (err) {
            return next(new customError_1.customError(err.message, 500));
        }
    }),
    searchUser: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const query = Object.assign({}, req.query);
        try {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const isEmail = re.test(String(req.query.search));
            if (!req.query.search) {
                return next(new customError_1.customError("Search not found", 404));
            }
            if (isEmail == true) {
                const users = yield User_1.default.findOne({ email: new RegExp(`^${query.search}$`, 'i') });
                console.log(users);
                if (users) {
                    (0, success_response_1.default)(res, [users], 200, "User Fetched Successfully");
                }
                else {
                    return next(new customError_1.customError("User not found or disabled", 404));
                }
            }
            else {
                let users;
                let nameArr = query.search.split(" ");
                console.log(nameArr);
                if (nameArr.length < 2) {
                    users = yield User_1.default.find({
                        $or: [{ firstName: new RegExp(`^${nameArr[0]}$`, 'i') },
                            { lastName: new RegExp(`^${nameArr[0]}$`, 'i') }]
                    });
                }
                else {
                    console.log(true);
                    users = yield User_1.default.find({
                        $or: [{
                                firstName: new RegExp(`^${nameArr[0]}$`, 'i'),
                                lastName: new RegExp(`^${nameArr[1]}$`, 'i')
                            },
                            {
                                lastName: new RegExp(`^${nameArr[0]}$`, 'i'),
                                firstName: new RegExp(`^${nameArr[1]}$`, 'i')
                            }]
                    });
                    console.log(users);
                }
                (0, success_response_1.default)(res, users, 200, "User Fetched Successfully");
            }
        }
        catch (err) {
            return next(new customError_1.customError(err.message, 500));
        }
    }),
    deleteUser: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const authUser = yield User_1.default.findByIdAndDelete(id);
            if (authUser) {
                (0, success_response_1.default)(res, undefined, 200, "user deleted Successfully");
            }
            else {
                return next(new customError_1.customError("User not found or disabled", 404));
            }
        }
        catch (err) {
            return next(new customError_1.customError(err.message, 500));
        }
    }),
    deleteAccount: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req;
        try {
            const authUser = yield User_1.default.findByIdAndDelete(userId);
            if (authUser) {
                (0, success_response_1.default)(res, undefined, 200, "Account deleted Successfully");
            }
            else {
                return next(new customError_1.customError("Account not found or disabled", 404));
            }
        }
        catch (err) {
            return next(new customError_1.customError(err.message, 500));
        }
    }),
    updateProfile: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req;
        try {
            const newUser = yield User_1.default.findByIdAndUpdate(userId, req.body, { runValidators: true, new: true });
            if (newUser) {
                (0, success_response_1.default)(res, newUser, 200, "Profile Updated Successfully");
            }
            else {
                return next(new customError_1.customError("User not found or disabled", 404));
            }
        }
        catch (err) {
            return next(new customError_1.customError(err.message, 500));
        }
    }),
    updateUser: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const newUser = yield User_1.default.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
            if (newUser) {
                (0, success_response_1.default)(res, newUser, 200, "User Updated Successfully");
            }
            else {
                return next(new customError_1.customError("User not found or disabled", 404));
            }
        }
        catch (err) {
            return next(new customError_1.customError(err.message, 500));
        }
    })
};
exports.default = user;
//# sourceMappingURL=user.controllers.js.map
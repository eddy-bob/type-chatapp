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
const nodemailer_1 = __importDefault(require("../services/nodemailer"));
const verifyEmail_1 = __importDefault(require("../entities/verifyEmail"));
const customError_1 = require("../helpers/customError");
const User_1 = __importDefault(require("../entities/User"));
const endpoints_config_1 = __importDefault(require("../config/endpoints.config"));
const auth = {
    register: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield User_1.default.create(req.body);
            // hashpassword
            yield data.hashPassword();
            yield data.save();
            const newUser = yield User_1.default.findOne({ email: req.body.email });
            if (newUser) {
                // create user to verify email collection
                const emailVerification = yield verifyEmail_1.default.create({
                    user: newUser._id
                });
                // get verify email token
                const verifyEmailToken = yield emailVerification.getToken();
                yield emailVerification.save();
                const url = `${req.protocol}://localhost:3000/verify-email/${verifyEmailToken}`;
                // send welcome mail
                const mail = yield (0, nodemailer_1.default)(req.body.email, endpoints_config_1.default.contactAddress, "Welcome to type-chat-app. You are getting this mail because you have just recently opened an account with us.please disregard if you didnt.Cclick on the link below to verify your account", "Account creation", url);
                (0, success_response_1.default)(res, newUser, 200, "user created successfully");
            }
            else {
                return next(new customError_1.customError("Failed to create user"));
            }
        }
        catch (err) {
            return next(new customError_1.customError(err.message, 500));
        }
    }),
    login: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return next(new customError_1.customError("Email and Password required", 400));
            }
            const user = yield User_1.default.findOne({ email }).select("+password");
            if (!user) {
                return next(new customError_1.customError("User not a registered User", 400));
            }
            const isAuth = yield user.comparePassword(password);
            if (isAuth == true) {
                const authUser = yield User_1.default.findByIdAndUpdate(user._id, { $set: { isLoggedIn: true } }, { runValidators: true, new: true });
                const token = yield authUser.getToken();
                (0, success_response_1.default)(res, authUser, 201, "Signin successful", token);
            }
            else {
                return next(new customError_1.customError("Sorry Email and Password did not work", 401));
            }
        }
        catch (err) {
            return next(new customError_1.customError(err.message, 500));
        }
    }),
    forgotPasswordInit: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            const user = yield User_1.default.findOne({ email });
            if (!email) {
                return next(new customError_1.customError("please provide an email", 400));
            }
            if (!user) {
                return next(new customError_1.customError("Email not linked to any registered user", 404));
            }
            const resetToken = yield user.genResetPasswordToken();
            yield user.save();
            if (!resetToken) {
                return next(new customError_1.customError("sorry something went wrong and couldnt send reset password link", 500));
            }
            const subject = "forgot password";
            const message = `you requested a reset password.click on the link below to reset password .`;
            const url = `https://localhost:3000/auth/reset-password/${resetToken}`;
            const err = (0, nodemailer_1.default)(email, endpoints_config_1.default.contactAddress, message, subject, url);
            (0, success_response_1.default)(res, undefined, 200, "reset password link sent to email");
        }
        catch (err) {
            return next(new customError_1.customError(err.message, 500));
        }
    }),
    forgotPasswordComplete: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { token } = req.params;
            var { newPassword, confirmPassword } = req.body;
            const user = yield User_1.default.findOne({
                resetPasswordToken: token,
                $gte: { resetPasswordExpire: new Date(Date.now()) },
            }).select(["resetPasswordToken", "resetPasswordExpire"]);
            if (!user) {
                return next(new customError_1.customError("token does not exist or expired"));
            }
            if (!newPassword || !confirmPassword) {
                return next(new customError_1.customError("please include a new password and confirm password", 400));
            }
            if (newPassword !== confirmPassword) {
                return next(new customError_1.customError("passwords must match", 400));
            }
            const newUser = yield User_1.default.findOneAndUpdate({
                resetPasswordToken: token,
                $gte: { resetPasswordExpire: new Date(Date.now()) },
            }, { $set: { password: newPassword } }, { runValidators: true, new: true }).select("password");
            yield newUser.hashPassword(newPassword);
            yield newUser.save();
            const cleanUser = yield User_1.default.findById(newUser._id);
            (0, success_response_1.default)(res, cleanUser, 201, "password updated successfully");
        }
        catch (err) {
            return next(new customError_1.customError(err.message, 500));
        }
    }),
    updatePassword: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            var { newPassword, oldPassword } = req.body;
            const { userId } = req;
            if (!newPassword || !oldPassword) {
                return next(new customError_1.customError("please include new password and old password", 400));
            }
            const user = yield User_1.default.findById(userId).select("+password");
            const oldIsInDatabase = yield user.comparePassword(oldPassword);
            // check if old password is equal to  password in database
            if (oldIsInDatabase == false) {
                return next(new customError_1.customError(" old  password must  be the same with previous password", 400));
            }
            // check if you are repeating the same password in database with the new password
            const newIsInDatabase = yield user.comparePassword(newPassword);
            if (newIsInDatabase) {
                return next(new customError_1.customError(" new  password must not be the same with previous password", 400));
            }
            // hash password
            const updateUser = yield User_1.default.findByIdAndUpdate(userId, {
                $set: {
                    password: newPassword,
                },
            }, { new: true, runValidator: true }).select("password");
            yield updateUser.hashPassword();
            yield updateUser.save();
            const cleanUser = yield User_1.default.findById(updateUser._id);
            (0, success_response_1.default)(res, cleanUser, 200, "password updated successfully");
        }
        catch (err) {
            return next(new customError_1.customError(err.message, 500));
        }
    }),
    verifyEmail: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req;
            const emailVerification = yield verifyEmail_1.default.create({
                user: userId,
            });
            // get verify email token
            const verifyEmailToken = yield emailVerification.getToken();
            console.log(verifyEmailToken);
            yield emailVerification.save();
            const url = `http://localhost:3000/verify-email/${verifyEmailToken}`;
            // send welcome mail
            const mail = yield (0, nodemailer_1.default)(req.body.email, endpoints_config_1.default.contactAddress, "Welcome to type-chat-app. You are getting this mail because you have just recently opened an account with us.please disregard if you didnt.Cclick on the link below to verify your account", "Account creation", url);
            (0, success_response_1.default)(res, undefined, 200, "Verification mail sent successfully");
        }
        catch (err) {
            return next(new customError_1.customError(err.message, 500));
        }
    }),
    checkVerifyEmailToken: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { token } = req.params;
            const { userId, userData } = req;
            const isToken = yield verifyEmail_1.default.findOne({
                user: userId,
                verificationToken: token,
                $gte: { expires: new Date(Date.now()) },
            });
            if (!isToken) {
                return next(new customError_1.customError("link expired or does not exist", 404));
            }
            if (userData.role && userData.role.verified == false) {
                yield User_1.default.findByIdAndUpdate(userId, { $set: { verified: true } });
                (0, success_response_1.default)(res, undefined, 200, "Email verified successfully");
            }
            else {
                (0, success_response_1.default)(res, undefined, 200, "Email Already Verified ");
            }
        }
        catch (err) {
            return next(new customError_1.customError(err.message, 500));
        }
    }),
    logout: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req;
            yield User_1.default.findByIdAndUpdate(userId, { $set: { isLoggedIn: false } }, { new: true, runValidators: true });
            res.status(200).json({
                success: true,
                message: "logged out successefully",
            });
        }
        catch (err) {
            return next(new customError_1.customError(err.message, 500));
        }
    }),
};
exports.default = auth;
//# sourceMappingURL=auth.controllers.js.map
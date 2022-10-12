"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const goecoder_1 = require("../services/goecoder");
const bcrypt = __importStar(require("bcrypt"));
const generateJWT_1 = __importDefault(require("../api/generateJWT"));
const endpoints_config_1 = __importDefault(require("../config/endpoints.config"));
const crypto = __importStar(require("crypto"));
// import { Point } from "geoJson"
// define enum
var UserEnum;
(function (UserEnum) {
    UserEnum["USER"] = "USER";
    UserEnum["ADMIN"] = "ADMIN";
    UserEnum["MODERATOR"] = "MODERATOR";
})(UserEnum || (UserEnum = {}));
const mongoose_1 = require("mongoose");
const User = new mongoose_1.Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, "please include a first name"]
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, "please include a last name"]
    },
    about: {
        type: String,
        trim: true,
        min: [10, "About you must not be less 10 letters"],
        max: [32, "About you must not be less 32 letters"]
    },
    password: {
        type: String,
        select: false,
        required: [true, "please include a password"],
        min: [6, "password can not be less than 6 characters"]
    },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },
    email: {
        required: [true, "please include an email"],
        type: String,
        index: { unique: true, dropDups: true },
        match: [
            // eslint-disable-next-line no-useless-escape
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "please add a valid email",
        ],
    },
    isLoggedIn: { type: Boolean, default: false },
    role: {
        required: true,
        type: String,
        enum: UserEnum,
        default: "USER"
    },
    photo: {
        mimeType: String,
        size: String,
        url: String
    },
    coverPhoto: {
        mimeType: String,
        size: String,
        url: String
    },
    mobile: {
        type: String,
        required: [true, "please include a mobile number"],
        index: { unique: true, dropDups: true }
    },
    region: {
        type: String,
    },
    zipcode: Number,
    location: {
        select: false,
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        },
    },
    formattedAddress: String,
    street: String,
    city: String,
    streetNumber: Number,
    country: String,
    countryCode: String,
    state: String,
    socket: String
}, { timestamps: true });
User.pre('save', function (next) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("zipcode") && !this.isModified("country")) {
            return next();
        }
        else {
            const loc = yield (0, goecoder_1.geocoder)([this.zipcode, this.country]);
            if (loc[0]) {
                this.location = {
                    type: 'Point',
                    coordinates: [loc[0].longitude, loc[0].latitude]
                };
                this.formattedAddress = (_a = loc[0]) === null || _a === void 0 ? void 0 : _a.formattedAddress,
                    this.countryCode = (_b = loc[0]) === null || _b === void 0 ? void 0 : _b.countryCode,
                    this.state = (_c = loc[0]) === null || _c === void 0 ? void 0 : _c.administrativeLevels.level1lon;
            }
        }
    });
});
User.methods.hashPassword = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const saltRounds = endpoints_config_1.default.bycriptHashRound;
        const hashPassword = bcrypt.hashSync(this.password, 10);
        this.password = hashPassword;
        return this.password;
    });
};
User.methods.comparePassword = function (oldPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt.compareSync(oldPassword, this.password);
    });
};
User.methods.genResetPasswordToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        let hashToken;
        var token = crypto.randomBytes(20).toString("hex");
        hashToken = crypto.createHash("sha256").update(token).digest("hex");
        // set expire=y date
        this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
        this.resetPasswordToken = hashToken;
        return hashToken;
    });
};
User.methods.getToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        var token = (0, generateJWT_1.default)({ id: this._id });
        return token;
    });
};
exports.default = (0, mongoose_1.model)("userMod", User);
//# sourceMappingURL=User.js.map
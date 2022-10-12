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
const nodemailer = __importStar(require("nodemailer"));
const endpoints_config_1 = __importDefault(require("../config/endpoints.config"));
const sendMail = (reciever, sender, message, subject, url, buttonMessage) => __awaiter(void 0, void 0, void 0, function* () {
    var error;
    const transporter = yield nodemailer.createTransport({
        port: 465,
        secure: true,
        host: endpoints_config_1.default.mailerHost,
        auth: {
            user: endpoints_config_1.default.mailUsername,
            pass: endpoints_config_1.default.mailPassword,
        },
    });
    // send mail with defined transport object
    yield transporter.sendMail({
        from: sender,
        to: reciever,
        subject: subject,
        html: `<p>${message}</p>
      <a href=${url}>${buttonMessage || 'verifyEmail'}</a> 
      `,
    }, function (err, result) {
        error = err;
        if (err) {
            error = err;
        }
        else {
        }
    });
    return error;
});
exports.default = sendMail;
//# sourceMappingURL=nodemailer.js.map
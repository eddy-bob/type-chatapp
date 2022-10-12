"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = void 0;
const moment_1 = __importDefault(require("moment"));
const format = (name, message) => {
    return {
        name,
        message,
        time: (0, moment_1.default)().format("hh:mm:ss A")
    };
};
exports.format = format;
//# sourceMappingURL=formatMessage.js.map
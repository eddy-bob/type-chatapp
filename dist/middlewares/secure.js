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
const customError_1 = require("../helpers/customError");
const validateToken_1 = require("../api/validateToken");
const User_1 = __importDefault(require("../entities/User"));
// declare fetch details 
// declare middleware
const secure = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // make sure req.headers.authorization doesnt come undefined
    if (typeof req.headers.authorization === "undefined") {
        req.headers.authorization = "";
    }
    if (req.headers.authorization === "") {
        return next(new customError_1.customError("You are not authorized to access this route", 401));
    }
    else {
        if (!req.headers.authorization.startsWith("Bearer")) {
            return next(new customError_1.customError("You are not authorized to access this route", 401));
        }
        const token = req.headers.authorization.split(" ")[1];
        const response = (0, validateToken_1.validateToken)(token);
        if (response.id) {
            // fetch user details from database
            const userDetails = yield User_1.default.findById(response.id);
            req.userId = response.id;
            // store user role in the userRole variable
            req.userRole = userDetails.role;
            req.userData = userDetails;
            next();
        }
        else {
            if (response.name === 'TokenExpiredError') {
                return next(new customError_1.customError("Token is expired", 401));
            }
            else {
                return next(new customError_1.customError("You are not authorized to access this route", 401));
            }
        }
    }
});
exports.default = secure;
//# sourceMappingURL=secure.js.map
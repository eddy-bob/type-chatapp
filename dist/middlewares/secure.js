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
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = require("../helpers/customError");
const validateToken_1 = require("../api/validateToken");
const User_1 = require("../entities/User");
const typeorm_1 = require("typeorm");
// instantiate repository
const repository = typeorm_1.getMongoRepository(User_1.User);
let userDetails;
// declare fetch details 
const getUserDetails = (id, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        userDetails = yield repository.findOne({ where: { id: id } });
        console.log(userDetails);
    }
    catch (err) {
        return next(new customError_1.customError());
    }
});
// declare middleware
const secure = (req, res, next) => {
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
        const response = validateToken_1.validateToken(token);
        if (response.id) {
            // fetch user details from database
            getUserDetails(response.id, next),
                // store user id in the userId variable
                req.userId = response.id;
            // store user role in the userRole variable
            req.userRole = userDetails.role;
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
};
exports.default = secure;
//# sourceMappingURL=secure.js.map
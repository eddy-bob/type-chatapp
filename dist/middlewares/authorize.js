"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = require("../helpers/customError");
const authorize = ([...roles]) => {
    return (req, res, next) => {
        if (roles.includes(req.userRole)) {
            next();
        }
        else {
            return next(new customError_1.customError("You are forbidden to access this route", 403));
        }
    };
};
exports.default = authorize;
//# sourceMappingURL=authorize.js.map
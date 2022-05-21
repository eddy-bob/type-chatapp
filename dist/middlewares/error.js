"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error = (err, req, res, next) => {
    if (err.message.startsWith("E11000 duplicate key error collection")) {
        return res
            .status(err.statusCode || 500)
            .json({
            success: false,
            data: null,
            Error: "sorry no two users can have matching details eg email,username,phone number,reg/matric number,  etc",
        });
    }
    else {
        res
            .status(err.statusCode || 500)
            .json({ success: false, data: null, Error: err.message });
    }
};
exports.default = error;
//# sourceMappingURL=error.js.map
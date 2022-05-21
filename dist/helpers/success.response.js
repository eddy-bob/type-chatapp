"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const successResponse = (response, data, statusCode, message, access_token) => {
    if (access_token) {
        response.status(statusCode).json({ data, message, access_token });
    }
    else {
        response.status(statusCode).json({ data, message });
    }
    return;
};
exports.default = successResponse;
//# sourceMappingURL=success.response.js.map
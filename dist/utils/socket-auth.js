"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateToken_1 = require("../api/validateToken");
const socketAuth = (token) => {
    const response = (0, validateToken_1.validateToken)(token);
    return response;
};
exports.default = socketAuth;
//# sourceMappingURL=socket-auth.js.map
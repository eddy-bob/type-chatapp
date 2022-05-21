"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customError = void 0;
class customError extends Error {
    constructor(message, statusCode, name) {
        super(message);
        this.statusCode = statusCode,
            this.name = name,
            Object.setPrototypeOf(this, customError.prototype);
    }
}
exports.customError = customError;
;
//# sourceMappingURL=customError.js.map
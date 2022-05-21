"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
// instantiate enviroment variables
dotenv_1.config({ path: ".env" });
const endpoint = {
    port: process.env.PORT,
    mongoString: process.env.DB_CONN_STRING,
    mongoName: process.env.DB_NAME,
    userName: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    bycriptHashRound: process.env.HASH_ROUND
};
exports.default = endpoint;
//# sourceMappingURL=endpoints.config.js.map
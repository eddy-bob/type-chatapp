"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
// instantiate enviroment variables
(0, dotenv_1.config)({ path: ".env" });
const endpoint = {
    port: process.env.PORT,
    baseUrl: process.env.BASE_URL,
    mongoString: process.env.DB_CONN_STRING,
    mongoName: process.env.DB_NAME,
    userName: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    bycriptHashRound: process.env.HASH_ROUND,
    enviroment: process.env.NODE_ENV,
    cloudName: process.env.CLOUD_NAME,
    cloudinaryUrl: process.env.CLOUDINARY_URL,
    cloudApiSecret: process.env.CLOUD_API_SECRET,
    cloudApiKey: process.env.CLOUD_API_KEY,
    contactAddress: process.env.MY_CONTACT_ADDRESS,
    mailPassword: process.env.MAIL_PASSWORD,
    mailUsername: process.env.MAIL_USERNAME,
    mailerHost: process.env.NODE_MAILER_HOST,
    passPhrase: process.env.PASSPHRASE
};
exports.default = endpoint;
//# sourceMappingURL=endpoints.config.js.map
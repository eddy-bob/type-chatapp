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
const endpoints_config_1 = __importDefault(require("../config/endpoints.config"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
// import { MongoClient, Db } from "mongodb"
const database = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield typeorm_1.createConnection({
        type: "mongodb",
        "name": endpoints_config_1.default.mongoName,
        "url": endpoints_config_1.default.mongoString,
        "useNewUrlParser": true,
        "ssl": true,
        "synchronize": true,
        "logging": false,
        "useUnifiedTopology": true,
        "entities": [
            "src/entity/**/*.ts"
        ]
    });
    if (connection.isInitialized == true) {
        console.log(`Successfully connected to database: ${connection.name}`.blue);
    }
    // const client: MongoClient = new MongoClient(endPoint.mongoString);
    // await client.connect();
    // const db: Db = client.db(endPoint.mongoName);
    // console.log(`Successfully connected to database: ${db.databaseName}`.blue);
});
exports.default = database;
//# sourceMappingURL=database.js.map
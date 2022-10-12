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
const mongoose_1 = __importDefault(require("mongoose"));
const database = () => __awaiter(void 0, void 0, void 0, function* () {
    // let myConnection: Connection;
    // const hasConnection = getConnectionManager().has(endPoint.mongoName);
    // if (hasConnection) {
    //        myConnection = getConnectionManager().get(endPoint.mongoName);
    //        if (!myConnection.isConnected) {
    //               myConnection = await myConnection.connect();
    //        }
    // }
    // else {
    //        const connectionOptions: ConnectionOptions = {
    //               type: "mongodb",
    //               name: 'default',
    //               url: endPoint.mongoString,
    //               useNewUrlParser: true,
    //               ssl: true,
    //               synchronize: true,
    //               logging: false,
    //               useUnifiedTopology: true,
    //               entities: [
    //                      User
    //               ]
    //        }
    // const connection = await createConnection(connectionOptions)
    // if (connection.isInitialized == true) { console.log(`Successfully connected to database: ${connection.name}`.blue); }
    // const client: MongoClient = new MongoClient(endPoint.mongoString);
    // await client.connect();
    // const db: Db = client.db(endPoint.mongoName);
    const db = mongoose_1.default.connect(endpoints_config_1.default.mongoString);
    console.log(`Successfully connected to database: ${endpoints_config_1.default.mongoName}`.blue);
});
exports.default = database;
//# sourceMappingURL=database.js.map
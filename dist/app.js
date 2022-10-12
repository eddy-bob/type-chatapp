"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const error_1 = __importDefault(require("./middlewares/error"));
const endpoints_config_1 = __importDefault(require("./config/endpoints.config"));
const Router_1 = __importDefault(require("./core/Router"));
const compression_1 = __importDefault(require("compression"));
const body_parser_1 = __importDefault(require("body-parser"));
const colors_1 = __importDefault(require("colors"));
const path = __importStar(require("path"));
const database_1 = __importDefault(require("./database/database"));
const socketConnection_1 = require("./services/socketConnection");
const http = __importStar(require("http"));
const app = (0, express_1.default)();
exports.app = app;
var server = http.createServer(app);
exports.server = server;
// instantiate database
(0, database_1.default)();
const io = require("socket.io")(server, {
    cors: {
        origin: ["http://localhost:3000", "https://echat.vercel.app"],
    },
});
// pass socket to custom
socketConnection_1.socketCon.socketConnection(io);
app.set("socketio", io); //here you export my socket.io to a global
// app.use(cors({ origin: ["http://localhost:3000", "http://localhost:8080", "http://localhost:4200","https://echat.vercel.app"] }))
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://echat.vercel.app");
    // Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    next();
});
// serve static files
app.use(express_1.default.static(path.resolve(__dirname, "/public")));
app.set("port", endpoints_config_1.default.port);
app.set("enviroment", endpoints_config_1.default.enviroment);
// instantiate colors for use in app
colors_1.default.enable();
// compress all the responses  to reduce data consumption
app.use((0, compression_1.default)());
// add set of security middlewares
// app.use(helmet())
// parser all incoming request and  append data to req.body
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// send a default welcome page when you hit the root router
app.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});
app.use("/api/v1", Router_1.default);
// Handle 404 Requests
app.use("*", (req, res, next) => {
    (0, error_1.default)({ message: "Route Not Found", statusCode: 404 }, req, res, next);
});
app.use(error_1.default);
//# sourceMappingURL=app.js.map
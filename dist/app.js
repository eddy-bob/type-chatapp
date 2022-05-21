"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_1 = __importDefault(require("./middlewares/error"));
const endpoints_config_1 = __importDefault(require("./config/endpoints.config"));
const Router_1 = __importDefault(require("./core/Router"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const database_1 = __importDefault(require("./database/database"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const colors_1 = __importDefault(require("colors"));
const app = express_1.default();
// set app port
app.set("port", endpoints_config_1.default.port);
// instantiate colors for use in app
colors_1.default.enable();
// run database
database_1.default();
app.use(error_1.default),
    // compress all the responses  to reduce data consumption
    app.use(compression_1.default());
// add set of security middlewares
app.use(helmet_1.default());
// parser all incoming request and  append data to req.body
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(cors_1.default({ origin: ["http://localhost:3000", "http://localhost:8080", "http://localhost:4200"] }));
app.use("/api/v1", Router_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map
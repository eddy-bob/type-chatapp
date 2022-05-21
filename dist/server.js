"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const process_1 = require("process");
const port = app_1.default.get("port");
// create server
const server = () => {
    // send a default welcome page when you hit the root router
    app_1.default.get("/", (req, res, next) => {
        res.send("........welcome to type-chat-app.You must have strck the wrong route that is why you are here........");
    });
    const myApp = app_1.default.listen(port, "0.0.0.0", () => { console.log(`server running on port ${port}`.blue); });
    process.on('unhandledRejection', function (reason) {
        console.log((reason.name + ":", reason.message).underline.red);
        myApp.close(() => {
            console.log("server closed".red);
            process_1.exit(1);
        });
    });
};
server();
//# sourceMappingURL=server.js.map
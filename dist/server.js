"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
require("reflect-metadata");
const fs_1 = require("fs");
const process_1 = require("process");
const port = app_1.app.get("port");
const mode = app_1.app.get("enviroment");
const server = () => {
    const myApp = app_1.server.listen(port, "0.0.0.0", () => { console.log(`server running on port ${port} in mode ${mode}`.blue); });
    process.on('unhandledRejection', function (reason) {
        // write error to file
        (0, fs_1.appendFileSync)("error.txt", `\n Error: ${new Date(Date.now())} ${reason.message}`);
        if (reason.message === "querySrv ESERVFAIL _mongodb._tcp.nodechatapp.khmbi.mongodb.net") {
            myApp.close(() => {
                console.log((reason.name + ":", reason.message).underline.red);
                console.log("server closed".red);
                (0, process_1.exit)(1);
            });
        }
        else {
            console.log(reason.message.red);
        }
    });
};
server();
//# sourceMappingURL=server.js.map
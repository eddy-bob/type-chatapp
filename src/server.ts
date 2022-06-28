import { app, server as appServer } from "./app"
import "reflect-metadata";
import { appendFileSync } from "fs";

import { exit } from 'process';
import { Request, Response, NextFunction } from "express"
import * as path from "path"
const port = app.get("port")
const mode = app.get("enviroment")

const server = (): void => {

       const myApp = appServer.listen(port, "0.0.0.0", () => { console.log(`server running on port ${port} in mode ${mode}`.blue) });
       process.on('unhandledRejection', function (reason: Error) {

              // write error to file
              appendFileSync("error.txt", `Error:${reason.message}`)


              if (reason.message === "querySrv ESERVFAIL _mongodb._tcp.nodechatapp.khmbi.mongodb.net") {
                     myApp.close(() => {
                            console.log((reason.name + ":", reason.message).underline.red);
                            console.log("server closed".red)

                            exit(1)

                     })
              }
              else { console.log(reason.message.red) }

       });
}

server()
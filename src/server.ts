import { app, server as appServer } from "./app"
import "reflect-metadata";

import { exit } from 'process';
import { Request, Response, NextFunction } from "express"
import * as path from "path"
const port = app.get("port")
const mode = app.get("enviroment")

const server = (): void => {

       const myApp = appServer.listen(port, "0.0.0.0", () => { console.log(`server running on port ${port} in mode ${mode}`.blue) });
       process.on('unhandledRejection', function (reason: Error) {
              if (reason.message === "jwt expired") {
                     console.log("token expired")

              }
              else {
                     myApp.close(() => {
                            console.log((reason.name + ":", reason.message).underline.red);
                            console.log("server closed".red)

                            exit(1)

                     })
              }

       });
}

server()
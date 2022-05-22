import app from "./app"
import { exit } from 'process';
import { Request, Response, NextFunction } from "express"
const port = app.get("port")
const mode = app.get("enviroment")

// create server
const server = (): void => {
       // send a default welcome page when you hit the root router
       app.get("/", (req: Request, res: Response, next: NextFunction) => {
              res.send("........welcome to type-chat-app.You must have strck the wrong route that is why you are here........")
       })
       const myApp = app.listen(port, "0.0.0.0", () => { console.log(`server running on port ${port} in mode ${mode}`.blue) });
       process.on('unhandledRejection', function (reason: Error) {
              console.log((reason.name + ":", reason.message).underline.red);
              myApp.close(() => {
                     console.log("server closed".red)

                     exit(1)

              })


       });
}

server()
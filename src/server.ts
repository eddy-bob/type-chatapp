import app from "./app"
import { exit } from 'process';
const port = app.get("port")

// create server
const server = (): void => {
       const myApp = app.listen(port, "0.0.0.0", () => { console.log(`server running on port ${port}`.blue) });
       process.on('unhandledRejection', function (reason: Error) {
              console.log((reason.name + ":", reason.message).underline.red);
              myApp.close(() => {
                     console.log("server closed".red)

                     exit(1)

              })


       });
}

server()
import express from "express";
import error from "../middlewares/error";
import endpoints from "../config/endpoints.config";
import useRouter from "../core/Router";
import helmet from "helmet";
import compression from "compression";
import bodyParser from "body-parser";
import cors from "cors";
import colors from "colors";
import * as path from "path";
import database from "../database/database";
import { socketCon } from "../services/socketConnection";
import * as http from "http";
import { Request, Response, NextFunction } from "express";
const app: express.Application = express();

var server = http.createServer(app);

// instantiate database
database();

const io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://eddychat.netlify.app",
      "https://echat.vercel.app",
    ],
  },
});

// pass socket to custom
socketCon.socketConnection(io);

app.set("socketio", io); //here you export my socket.io to a global
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://echat.vercel.app",
      "https://eddychat.netlify.app",
    ],
  })
);

// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   console.log(origin);
//   const allowedOrigins = ["https://echat.vercel.app", "http://localhost:3000"];
//   if (allowedOrigins.includes(origin as string)) {
//     console.log("yeo origin allowed");
//     res.setHeader("Access-Control-Allow-Origin", origin as string);

//     // // Request methods you wish to allow
//     // res.setHeader(
//     //   "Access-Control-Allow-Methods",
//     //   "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//     // );

//     // // Request headers you wish to allow
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "X-Requested-With,Content-Type,Authorization,Origin, X-Auth-Token'"
//     );
//     // // Request headers you wish to allow
//     res.setHeader("Access-Control-Max-Age", "86400");
//   }
//   console.log("headers middle ware ran");
//   next();
// });

// serve static files
app.use(express.static(path.resolve(__dirname, "/public")));
app.set("port", endpoints.port);
app.set("enviroment", endpoints.enviroment);

// instantiate colors for use in app
colors.enable();

// compress all the responses  to reduce data consumption
app.use(compression());
// add set of security middlewares
// app.use(helmet())
// parser all incoming request and  append data to req.body
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// send a default welcome page when you hit the root router
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
app.use("/api/v1", useRouter);
// Handle 404 Requests
app.use("*", (req, res, next) => {
  error({ message: "Route Not Found", statusCode: 404 }, req, res, next);
});

app.use(error);

export { app, server };

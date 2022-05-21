import express from "express"
import error from "./middlewares/error"
import endpoints from "./config/endpoints.config"
import useRouter from "./core/Router";
import helmet from "helmet";
import compression from "compression";
import database from "./database/database"
import bodyParser from "body-parser";
import cors from "cors"
import colors from 'colors';

const app: express.Application = express();
// set app port
app.set("port", endpoints.port)
// instantiate colors for use in app
colors.enable()
// run database
database()
app.use(error),

       // compress all the responses  to reduce data consumption
       app.use(compression())
// add set of security middlewares
app.use(helmet())
// parser all incoming request and  append data to req.body
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:8080", "http://localhost:4200"] }))
app.use("/api/v1", useRouter)

export default app
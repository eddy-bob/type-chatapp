import { Router } from "express";
import call from "../controllers/call.controller";
const callRouter = Router();
import secure from "../middlewares/secure";
callRouter.use(secure as any);
callRouter.get("/", call.getAllCalls);

export default callRouter;

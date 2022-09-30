import { Router } from "express";
import video from "../controllers/video.controller";
const friendRouter = Router();
import secure from "../middlewares/secure";
friendRouter.use(secure as any);
friendRouter.get("/", video.getVideoCalls);

export default friendRouter;

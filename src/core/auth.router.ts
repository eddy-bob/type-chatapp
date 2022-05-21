import { Router } from "express"
import auth from "../controllers/auth.controllers"
const authRouter = Router();
authRouter.post("/register", auth.register)
authRouter.post("/login", auth.login)
export default authRouter
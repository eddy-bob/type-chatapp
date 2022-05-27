import { Router } from "express"
import auth from "../controllers/auth.controllers"
const authRouter = Router();
import secure from "../middlewares/secure"
authRouter.post("/register", auth.register)
authRouter.post("/login", auth.login)
authRouter.get("/logout", auth.logout)
authRouter.put("/update-password", secure, auth.updatePassword)
authRouter.post("/forgot-password/init", auth.forgotPasswordInit)
authRouter.put("/:token/reset-password", auth.forgotPasswordComplete)
authRouter.get("/verify-email/init", secure, auth.verifyEmail)
authRouter.get(`/verify-email/:token/confirm`, secure, auth.checkVerifyEmailToken)




export default authRouter
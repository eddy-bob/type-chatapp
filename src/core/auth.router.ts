import { Router } from "express"
import auth from "../controllers/auth.controllers"
const authRouter = Router();

authRouter.post("/register", auth.register)
authRouter.post("/login", auth.login)
authRouter.post("/logout", auth.logout)
authRouter.put("/update-password", auth.updatePassword)
authRouter.post("/forgot-password/init", auth.forgotPasswordInit)
authRouter.post("/:token/reset-password", auth.forgotPasswordComplete)
authRouter.get("/verify-email/init", auth.verifyEmail)
authRouter.get(`/verify-email/:token/confirm`, auth.checkVerifyEmailToken)




export default authRouter
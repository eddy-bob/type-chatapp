import { Router } from "express"
import authRouter from "./auth.router"
const useRouter = Router();
useRouter.use("/user/auth", authRouter)
export default useRouter
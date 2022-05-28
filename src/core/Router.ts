import { Router } from "express"
import authRouter from "./auth.router"
import groupRouter from "./group.router"
import groupChatRouter from "./group.chat.router"

const useRouter = Router();
useRouter.use("/user/auth", authRouter)
useRouter.use("/group", groupRouter)
useRouter.use("/group/chat", groupChatRouter)


export default useRouter
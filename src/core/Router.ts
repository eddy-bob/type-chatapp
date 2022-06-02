import { Router } from "express"
import authRouter from "./auth.router"
import groupRouter from "./group.router"
import privateChatRouter from "./chat.router"
import groupChatRouter from "./group.chat.router"
import friendRouter from "./friend.router"

import friendRequestRouter from "./friendRequest.router"

const useRouter = Router();
useRouter.use("/user/auth", authRouter)
useRouter.use("/group", groupRouter)
useRouter.use("/group/chat", groupChatRouter)
useRouter.use("/user/private-chat", privateChatRouter)
useRouter.use("/user/friend", friendRouter)
useRouter.use("/user/friend/request", friendRequestRouter)




export default useRouter
import { Router } from "express";
import authRouter from "./auth.router";
import groupRouter from "./group.router";
import privateChatRouter from "./chat.router";
import groupChatRouter from "./group.chat.router";
import friendRouter from "./friend.router";
import userRouter from "./user.router";
import friendRequestRouter from "./friendRequest.router";
import recentPrivateChatRouter from "./recentChats.router";
import videoRouter from "./video.router";

const useRouter = Router();
useRouter.use("/user/auth", authRouter);
useRouter.use("/group", groupRouter);
useRouter.use("/group/chat", groupChatRouter);
useRouter.use("/user/private-chat", privateChatRouter);
useRouter.use("/user/friend", friendRouter);
useRouter.use("/user", userRouter);
useRouter.use("/videoCall", videoRouter);
useRouter.use("/user/friend/request", friendRequestRouter);
useRouter.use("/user/recent-private-chat", recentPrivateChatRouter);

export default useRouter;

import { Router } from "express"
import recentChat from "../controllers/recent-private-chat.controller"
const recentPrivateChatRouter = Router();
import secure from "../middlewares/secure"
recentPrivateChatRouter.use(secure as any)
recentPrivateChatRouter.post("/add", recentChat.addRecentChat)
recentPrivateChatRouter.get("/", recentChat.getRecentChats)





export default recentPrivateChatRouter
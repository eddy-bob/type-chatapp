import { Router } from "express"
import groupChat from "../controllers/groupChat.controllers"
const groupChatRouter = Router();
import secure from "../middlewares/secure"
groupChatRouter.use(secure)
groupChatRouter.post("/add-chat", groupChat.addChat)
groupChatRouter.delete("/delete/:groupId/chatId", groupChat.deleteChat)
groupChatRouter.get("/update/:groupId", groupChat.getChats)





export default groupChatRouter
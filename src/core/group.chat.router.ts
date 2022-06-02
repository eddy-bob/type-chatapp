import { Router } from "express"
import groupChat from "../controllers/groupChat.controllers"
const groupChatRouter = Router();
import secure from "../middlewares/secure"
groupChatRouter.use(secure)
groupChatRouter.delete("/delete", groupChat.deleteChat)
groupChatRouter.get("/update/:groupId", groupChat.getChats)





export default groupChatRouter
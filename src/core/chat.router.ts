import { Router } from "express"
import privateMessage from "../controllers/privateChat.controllers"
const privateChatRouter = Router();
import secure from "../middlewares/secure"
privateChatRouter.use(secure as any)
privateChatRouter.delete("/delete/:chatId", privateMessage.deleteChat)
privateChatRouter.get("/get-chats", privateMessage.getChats)





export default privateChatRouter
import { Router } from "express"
import friend from "../controllers/friend.controllers"
const friendRouter = Router();
import secure from "../middlewares/secure"
friendRouter.use(secure)
friendRouter.put("/:friendId/block", friend.blockFriend)
friendRouter.put("/:friendId/unblock", friend.unblockFriend)
friendRouter.get("/", friend.getFriends)






export default friendRouter
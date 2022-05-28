import { Router } from "express"
import group from "../controllers/group.controllers"
const groupRouter = Router();
import secure from "../middlewares/secure"
groupRouter.use(secure)
groupRouter.post("/create", group.createGroup)
groupRouter.delete("/delete/:groupId", group.deleteGroup)
groupRouter.put("/update/:groupId", group.updateGroup)
groupRouter.get("/fetch-groups", group.getGroups)
groupRouter.get("/get-group/:groupId", group.getGroup)





export default groupRouter
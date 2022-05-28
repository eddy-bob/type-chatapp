import { Router } from "express"
import user from "../controllers/user.controllers"
const userRouter = Router();
import secure from "../middlewares/secure"
import authorize from "../middlewares/authorize"

user.use(secure)
userRouter.get("/users", authorize, user.getUsers)
userRouter.get("/user-profile/:id", user.getUser)
userRouter.delete("/delete-all", authorize, user.deleteUsers)
userRouter.delete("/delete-account", user.deleteUser)
userRouter.put("/update-user", user.updateUser)




export default userRouter
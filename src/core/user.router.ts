import { Router } from "express"
import user from "../controllers/user.controllers"
const userRouter = Router();
import secure from "../middlewares/secure"
import authorize from "../middlewares/authorize"

userRouter.use(secure as any)
userRouter.get("/users", authorize("ADMIN"), user.getUsers)
userRouter.get("/user-profile/:id", user.getUser)
userRouter.delete("/delete-all", authorize("ADMIN"), user.deleteUsers)
userRouter.delete("/delete-account", user.deleteUser)
userRouter.put("/update-user", user.updateUser)




export default userRouter
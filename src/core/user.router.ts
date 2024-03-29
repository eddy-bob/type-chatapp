import { Router } from "express"
import user from "../controllers/user.controllers"
const userRouter = Router();
import secure from "../middlewares/secure"
import authorize from "../middlewares/authorize"

userRouter.use(secure as any)
userRouter.get("/users", authorize(["ADMIN"]), user.getUsers)
userRouter.get("/user-profile/:id", user.getUser)
userRouter.get("/profile", user.getProfile)
userRouter.get("/search-user", user.searchUser)
userRouter.delete("/delete-all", authorize(["ADMIN"]), user.deleteUsers)
userRouter.delete("/delete-user-account/:id", authorize(["ADMIN"]), user.deleteUser)
userRouter.delete("/delete-account", user.deleteAccount)
userRouter.put("/update-user/:id", authorize(["ADMIN"]), user.updateUser)
userRouter.put("/update-profile", user.updateProfile)
userRouter.put("/update-profile-picture", user.uploadProfilePicture)
userRouter.get("/search-user", user.searchUser)
userRouter.put("/update-cover-photo", user.uploadCoverPicture)





export default userRouter
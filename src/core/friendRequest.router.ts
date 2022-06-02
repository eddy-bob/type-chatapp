import { Router } from "express"
import friendRequest from "../controllers/friendRequest.controllers"
const friendRequestRouter = Router();
import secure from "../middlewares/secure"
friendRequestRouter.use(secure as any)
friendRequestRouter.post("/:id/send-request", friendRequest.sendRequest)
friendRequestRouter.get("/:requestId/accept-request", friendRequest.acceptRequest)
friendRequestRouter.delete("/:requestId/reject-request", friendRequest.rejectRequest)

friendRequestRouter.delete("/:requestId/delete-request", friendRequest.deleteRequest)
friendRequestRouter.get("/", friendRequest.getRequests)







export default friendRequestRouter
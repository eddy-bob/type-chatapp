import { ObjectId } from "mongodb";
import UserMod from "../entities/User"
interface genFullName { (id: ObjectId): Promise<[string, string]> }
const genFullName: genFullName =
       async function (id: ObjectId) {

              const friend = await UserMod.findById(id)
              const fullname = `${friend.firstname} ' ' ${friend.firstname}`
              const picture = friend.photo.name
              return [fullname, picture,"eddy"]
       }

export default genFullName
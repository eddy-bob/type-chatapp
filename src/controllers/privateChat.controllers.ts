
import PrivateChat from "../entities/PrivateMessages"
import Friend from "../entities/Friend"
import { ObjectId } from "mongoose"
import PrivateMessages from "../entities/PrivateMessages"
import { customError } from "../helpers/customError"
import { format } from "../utils/formatMessage"
import { NextFunction, Request, Response } from "express"
import successResponse from "../helpers/success.response"

const privateChat = {
       addChat: async (socket: any, data: any, userId: ObjectId, io: any, userFullName: string) => {

              try {


                     const isFriend = await Friend.findOne({
                            friend: userId,
                            owner: data.userId,
                            blocked: false
                     })
                     if (!isFriend) {
                            return socket.emit("ChatError",
                                   { message: "You are not friends with this person", statusCode: 403 })
                     }
                     const newMessage = await PrivateMessages.create({ message: data.message, sender: userId, reciever: data.userId })
                     if (!newMessage) { return socket.emit("chatError", { message: "could not send message", statuseCode: 500 }) }
                     socket.emit("message", format(userFullName, data.message))
                     io.to(data.socketId).emit("newMessage", format({ name: userFullName, id: socket.id }, data.message)


                     )
              } catch (err: any) {
                     socket.emit("ChatError",
                            { message: err.message, statusCode: 500 })
              }

       },
       getChats: async (req: Request, res: Response, next: NextFunction) => {
              interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }
              const { friendId } = req.params

              const { userId, userRole } = req as customRes;
              try {
                     // const isFriend = await Friend.findOne({
                     //        owner: friendId,
                     //        friend: userId,
                     //        blocked: false
                     // })
                     // console.log(isFriend)
                     // if (!isFriend && userRole !== "ADMIN") { return next(new customError("you are not friends with this person", 403)) }
                     const chats = await PrivateChat.find({
                            $or: [{ sender: friendId, reciever: userId },
                            { sender: userId, reciever: friendId }],
                            hideFrom: { $ne: userId }
                     })
                     successResponse(res, chats, 200, "Chats fetched succesfully")

              } catch (err: any) {
                     next(new customError(err.message, 500))
              }



       },
       deleteChat: async (req: Request, res: Response, next: NextFunction) => {
              interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }
              const { chatId } = req.params;
              const { userId, userRole } = req as customRes;
              try {

                     const isChat = await PrivateMessages.findById(chatId)
                     if (!isChat) { return next(new customError("Chat doesnt exist", 404)) }
                     if (userRole === "ADMIN" || isChat.sender.toString() === userId) {
                            await PrivateMessages.findByIdAndDelete(chatId)
                     }
                     else {
                            PrivateChat.findByIdAndUpdate(chatId, { $set: { hideFrom: userId } })
                     }
                     successResponse(res, undefined, 201, "message deleted successfully")


              } catch (err: any) {
                     next(new customError(err.message, 500))

              }
       }
}
export default privateChat
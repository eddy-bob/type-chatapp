import { Response, Request, NextFunction } from "express"
import successResponse from "../helpers/success.response"
import { customError } from "../helpers/customError"
import groupMessage from "../entities/GroupMessages"
import Group from "../entities/Groups"
import User from "../entities/User"
import { ObjectId } from "mongoose"
import { format } from "../utils/formatMessage"
import privateChat from "../entities/PrivateMessages"
import friend from "../entities/Friend"

const groupChat = {
       forwardMessage: async (data: any, socket: any, userId: ObjectId, userData: any, userFullName: string, io: any) => {

              try {

                     const isMessage = await groupMessage.findOne(data.messageId)
                     if (!isMessage) {
                            return socket.emit("forwardfail", { statusCode: 400, message: `message to forward doesnt exist or deleted` })
                     }
                     data.recipients.forEach(async (recipient: { clientId: string, id: string }) => {
                            const isGroup = await Group.findOne({ _id: recipient.id, members: { $in: [userId] } })
                            const isUser = await User.findById(recipient.id)
                            if (isGroup) {
                                   const isSent = await groupMessage.create({
                                          owner: userId, message: isMessage.message,
                                          group: recipient, forwarded: true
                                   })
                                   if (isSent) {
                                          io.in(isGroup.name).emit("newGroupMessage", format(userFullName, isMessage.message))
                                   }
                                   else { return socket.emit("forwardfail", { statusCode: 500, message: `group message forward to ${isGroup.name} failed` }) }

                            }
                            else if (isUser) {
                                   const isFriend = await friend.findOne({ owner: recipient.id, friend: userId, blocked: false })
                                   if (!isFriend) {
                                          return socket.emit("forwardfail", {
                                                 statusCode: 401, message:
                                                        `private message forward to isUser.firstName} ${isUser.lastName} failed because you are not friends with the requested user`
                                          })
                                   }

                                   const sent = await privateChat.create({ sender: userId, reciever: recipient.id, message: isMessage.message, forwarded: true })

                                   if (sent) { io.to(recipient.clientId).emit("newMessage", format({ name: userFullName, id: socket.id }, isGroup.message)) }

                                   else { return socket.emit("forwardfail", { statusCode: 500, message: `private message forward to ${isUser.firstName} ${isUser.lastName} failed` }) }
                            }

                     })
              }

              catch (err: any) {

                     return socket.emit("forwardFail",
                            { message: err.message, statusCode: 500 })
              }
       },
       addChat: async (socket: any, data: any, userId: ObjectId, userData: any, io: any, userFullName: string) => {

              try {
                     const isGroup = await Group.findById(data.groupId)

                     if (!isGroup) {
                            return socket.emit("groupChatError",
                                   { message: "Group does not exist or disabled by admin", statusCode: 404 })
                     }
                     const isMember = isGroup.members.includes(userId)
                     if (isMember == true || userData.role === "ADMIN") {

                            const newChat = await groupMessage.create({

                                   group: data.groupId as unknown as ObjectId,
                                   sender: userId,
                                   message: data.message

                            })

                            await newChat.save()

                            io.in(isGroup.name).emit("newGroupMessage", format(userFullName, data.message))


                     }
                     else {
                            return socket.emit("groupChatError",
                                   { message: "You are not a member of this group", statusCode: 401 })
                     }


              } catch (err: any) {
                     socket.emit("groupChatError",
                            { message: err.message, statusCode: 500 })
              }
       },

       deleteChat: async (req: Request, res: Response, next: NextFunction) => {
              interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }
              const { chatId, groupId } = req.query;
              const { userId, userRole } = req as customRes;
              try {

                     const isGroup = await Group.findById(groupId)
                     const isChat = await groupMessage.findById(chatId)
                     if (!isGroup) { return next(new customError("Group doesnt exist or disabled by admin", 404)) }
                     if (!isChat) { return next(new customError("Chat doesnt exist", 404)) }

                     const isMember = isGroup.members.includes(userId)
                     if (isMember == true || userRole === "ADMIN") {


                            if (userRole === "ADMIN" || isGroup.admin.toString() === userId || isGroup.moderators.includes(userId) || isChat.sender.toString() === userId) {
                                   await groupMessage.findByIdAndDelete(chatId)
                            }
                            else {
                                   await groupMessage.findByIdAndUpdate(chatId,

                                          { $set: { $push: { hideFrom: userId } } })

                            }

                            successResponse(res, undefined, 201, "Chat deleted successfully")


                     }
                     else { return next(new customError("You must belong to this group to be able to delete a message")) }





              } catch (err: any) {

                     return next(
                            new customError(

                                   err.message, 500
                            )
                     );
              }
       },

       getChats: async (req: Request, res: Response, next: NextFunction) => {
              interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }
              const { groupId } = req.params;
              const { userId, userRole } = req as customRes

              try {

                     const isGroup = await Group.findById(groupId)
                     if (!isGroup) { return next(new customError("Group doesnt exist or disabled by admin", 404)) }

                     const isMember = isGroup.members.includes(userId)
                     if (isMember == true || userRole === "ADMIN") {
                     
                            const groupChats = await groupMessage.find({ group: groupId, hideFrom: { $nin: [userId] } })
                            successResponse(res, groupChats, 200, "chats fetched successfully")

                     }
                     else { return next(new customError("You must belong to this group to be able to join group")) }



              } catch (err: any) {

                     return next(
                            new customError(

                                   err.message, 500
                            )
                     );
              }
       },


}
export default groupChat
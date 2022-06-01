import { Response, Request, NextFunction } from "express"
import successResponse from "../helpers/success.response"
import { customError } from "../helpers/customError"
import groupMessage from "../entities/GroupMessages"
import Group from "../entities/Groups"
import { ObjectId } from "mongoose"
import { format } from "../utils/formatMessage"

const groupChat = {

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
              const { chatId, groupId } = req.params;
              const { userId, userRole } = req as customRes;
              try {

                     const isGroup = await Group.findById(groupId)
                     const isChat = await groupMessage.findById(chatId)
                     if (!isGroup) { return next(new customError("Group doesnt exist or disabled by admin", 404)) }
                     if (!isChat) { return next(new customError("Chat doesnt exist", 404)) }

                     const isMember = isGroup.members.includes(userId)
                     if (isMember == true || userRole === "ADMIN") {


                            if (userRole === "ADMIN" || isGroup.admin.toString() === userId || isGroup.moderators.includes(userId) || isChat.sender === userId) {
                                   await groupMessage.findByIdAndDelete(chatId)
                            }
                            else {
                                   await groupMessage.findByIdAndUpdate(chatId,

                                          { $set: { hideFrom: [...isChat.hideFrom, userId] } })

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
              const { groupId, userRole } = req.params;
              const { userId } = req as customRes

              try {

                     const isGroup = await Group.findById(groupId)
                     if (!isGroup) { return next(new customError("Group doesnt exist or disabled by admin", 404)) }

                     const isMember = isGroup.members.includes(userId)
                     if (isMember == true || userRole === "ADMIN") {

                            const groupChats = await groupMessage.find({})
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
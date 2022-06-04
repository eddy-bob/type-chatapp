import { Response, Request, NextFunction } from "express"
import successResponse from "../helpers/success.response"
import { customError } from "../helpers/customError"
import group from "../entities/Groups"
import { ObjectId } from "mongoose"
import { format } from "../utils/formatMessage"

const groupFunc = () => {
       return {

              createGroup: async (req: Request, res: Response, next: NextFunction) => {
                     interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }
                     const { name, description } = req.body

                     const { userId } = req as customRes;
                     try {

                            const newGroup = await group.create({ name, description, admin: userId, members: [userId] })

                            await newGroup.save()
                            successResponse(res, newGroup, 200, "Group created successfully")

                     } catch (err: any) {

                            return next(
                                   new customError(

                                          err.message, 500
                                   )
                            );
                     }
              },

              updateGroup: async (req: Request, res: Response, next: NextFunction) => {
                     interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }
                     const { groupId } = req.params;
                     const {name, description} = req.body
                     const { userId, userRole } = req as customRes;
                     try {

                            const isGroup = await group.findById(groupId)
                            if (!isGroup) { return next(new customError("Group doesnt exist or disabled by admin", 404)) }

                            if (userRole === "ADMIN" || isGroup.admin.toString() === userId || isGroup.moderators.includes(userId)) {
                                   const newGroup = await group.findByIdAndUpdate(groupId,
                                          {
                                                 $set:
                                                 {

                                                        name, description
                                                 }
                                          }, { runValidators: true, new: true })
                                   await newGroup.save()
                                   successResponse(res, newGroup, 200, "Group updated successfully")
                            }
                            else {
                                   return next(new customError("only moderators and  administrators may update this group"))
                            }




                     } catch (err: any) {

                            return next(
                                   new customError(

                                          err.message, 500
                                   )
                            );
                     }
              },
              deleteGroup: async (req: Request, res: Response, next: NextFunction) => {
                     interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }
                     const { groupId } = req.params;


                     const { userId, userRole, userData } = req as customRes;
                     try {

                            const isGroup = await group.findById(groupId)


                            if (!isGroup) { return next(new customError("Group doesnt exist or disabled by admin", 404)) }

                            if (userRole === "ADMIN" || isGroup.admin.toString() === userId) {
                                   const isGroup = await group.findByIdAndDelete(groupId)

                                   // if (isGroup) {
                                   //        socket.leave(isGroup.name)
                                   //        socket.emit("leaveGroup", "You have successfully left " + isGroup.name)
                                   //        socket.broadcast.to(isGroup.name).emit("groupLeaveSuccess", format(`${userData.firstName} ${userData.lastName}`, " group"))
                                   // }

                                   successResponse(res, undefined, 200, "Group deleted successfully")
                            }
                            else {
                                   return next(new customError("only administrators may delete this group"))
                            }




                     } catch (err: any) {

                            return next(
                                   new customError(

                                          err.message, 500
                                   )
                            );
                     }
              },

              getGroup: async (req: Request, res: Response, next: NextFunction) => {
                     interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }
                     const { groupId } = req.params;
                     const { userId, userRole } = req as customRes;
                     try {

                            const isGroup = await group.findById(groupId)
                            if (!isGroup) { return next(new customError("Group doesnt exist or disabled by admin", 404)) }


                            successResponse(res, isGroup, 200, "Group fetched successfully")





                     } catch (err: any) {

                            return next(
                                   new customError(

                                          err.message, 500
                                   )
                            );
                     }
              },

              getGroups: async (req: Request, res: Response, next: NextFunction) => {

                     try {

                            const groups = await group.find({})
                            successResponse(res, groups, 200, "Groups fetched successfully")





                     } catch (err: any) {

                            return next(
                                   new customError(

                                          err.message, 500
                                   )
                            );
                     }
              },
              joinGroup: async (data: any, socket: any, userId: ObjectId, userData: any) => {



                     try {
                            const isGroup = await group.findById(data.groupId)
                            if (!isGroup) {

                                   return socket.emit("groupError",
                                          { message: "Group does not exist or disabled by admin", statusCode: 404 })
                            }
                            if (isGroup.members.includes(userId)) {
                                   return socket.emit("groupError",
                                          { message: "You are already in this group", statusCode: 400 })
                            }

                            const updatedGroup = await group.findByIdAndUpdate(data.groupId,
                                   { $push: { members: userId } },
                                   { new: true, runValidators: true })

                            if (updatedGroup) {

                                   socket.join(isGroup.name)
                                   socket.emit("joinGroupSuccess", format(isGroup.name + "Bot", "Welcome to " + isGroup.name))
                                   socket.in(isGroup.name).emit("groupJoin", format(`${userData.firstName} ${userData.lastName}`, "joined group"))

                            }

                     } catch (err: any) {


                            return socket.emit("groupError",
                                   { message: err.message, statusCode: 500 })

                     }
              },
              leaveGroup: async (data: any, socket: any, userId: ObjectId, userData: any) => {



                     try {

                            const isGroup = await group.findOne({ _id: data.groupId, members: { $in: [userId] } })

                            if (!isGroup) {
                                   return socket.emit("groupError",
                                          { message: "Group doesnt exist or disabled by admin", statusCode: 404 })
                            }

                            await group.findByIdAndUpdate(data.groupId,
                                   { $pullAll: { members: [userId] } },
                                   { new: true, runValidators: true })

                            socket.leave(isGroup.name)
                            socket.emit("leaveGroupSuccess", { message: "You left" + isGroup.name, statusCode: 200 })
                            socket.broadcast.to(isGroup.name).emit("groupLeave", format(`${userData.firstName} ${userData.lastName}`, "joined group"))



                     } catch (err: any) {
                            socket.emit("groupError",
                                   { message: err.message, statusCode: 500 })

                     }
              },


       }

}
export default groupFunc
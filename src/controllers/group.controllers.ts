import { Response, Request, NextFunction } from "express"
import successResponse from "../helpers/success.response"
import { customError } from "../helpers/customError"
import group from "../entities/Groups"
import { ObjectId } from "mongoose"
import { format } from "../utils/formatMessage"

const appGroup = {

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
              const { members, name, description, moderators } = req.body
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
              const io = req.app.get('socketio');

              const { userId, userRole, userData } = req as customRes;
              try {

                     const isGroup = await group.findById(groupId)


                     if (!isGroup) { return next(new customError("Group doesnt exist or disabled by admin", 404)) }

                     if (userRole === "ADMIN" || isGroup.admin.toString() === userId) {
                            const isGroup = await group.findByIdAndDelete(groupId)
                            io.on("connection", (socket: any) => {
                                   if (isGroup) {
                                          socket.leave(isGroup.name)
                                          socket.emit("leaveGroup", "You have successfully left " + isGroup.name)
                                          socket.broadcast.to(isGroup.name).emit("groupLeave", format(`${userData.firstName} ${userData.lastName}`, "joined group"))
                                   }
                            })
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
       joinGroup: async (req: Request, res: Response, next: NextFunction) => {
              const io = req.app.get('socketio');
              interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }
              const { groupId } = req.params;
              const { userId, userData } = req as customRes;
              try {

                     const isGroup = await group.findById(groupId)
                     if (!isGroup) { return next(new customError("Group doesnt exist or disabled by admin", 404)) }
                     if (isGroup.members.includes(userId)) {
                            return next(new customError("you are already a part of this group", 400))
                     }
                     const updatedGroup = await group.findByIdAndUpdate(groupId,
                            { members: [...isGroup.members, userId] },
                            { new: true, runValidators: true })

                     io.on("connection", (socket: any) => {

                            if (updatedGroup) {
                                   socket.join(isGroup.name)
                                   socket.emit("joinGroup", "Welcome to " + isGroup.name)
                                   socket.broadcast.to(isGroup.name).emit("groupJoin", format(`${userData.firstName} ${userData.lastName}`, "joined group"))
                            }
                     }

                     )
                     // io.join("hello", function () {
                     //        console.log(io.id + " now in rooms ", io.rooms);
                     // });
                     //tell all the other groups that a user joined

                     successResponse(res, updatedGroup, 201, "Group joined successfully")





              } catch (err: any) {

                     return next(
                            new customError(

                                   err.message, 500
                            )
                     );
              }
       },
       leaveGroup: async (req: Request, res: Response, next: NextFunction) => {
              const io = req.app.get('socketio');
              interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }
              const { groupId } = req.params;
              const { userId, userData } = req as customRes;
              try {

                     const isGroup = await group.findOne({ _id: groupId, members: { $in: [userId] } })

                     if (!isGroup) { return next(new customError("Group doesnt exist or disabled by admin", 404)) }

                     const updatedGroup = await group.findByIdAndUpdate(groupId,
                            { $pullAll: { members: [userId] } },
                            { new: true, runValidators: true })
                     io.on("connection", (socket: any) => {
                            if (updatedGroup) {
                                   socket.leave(isGroup.name)
                                   socket.emit("leaveGroup", "You have successfully left " + isGroup.name)
                                   socket.broadcast.to(isGroup.name).emit("groupLeave", format(`${userData.firstName} ${userData.lastName}`, "joined group"))
                            }
                     }

                     )
                     // io.join("hello", function () {
                     //        console.log(io.id + " now in rooms ", io.rooms);
                     // });
                     //tell all the other groups that a user joined

                     successResponse(res, updatedGroup, 201, "Group joined successfully")





              } catch (err: any) {

                     return next(
                            new customError(

                                   err.message, 500
                            )
                     );
              }
       },


}
export default appGroup
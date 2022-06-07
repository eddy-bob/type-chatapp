import { Response, Request, NextFunction } from "express"
import successResponse from "../helpers/success.response"
import { customError } from "../helpers/customError"
import group from "../entities/Groups"
import { ObjectId } from "mongoose"
import { format } from "../utils/formatMessage"
import groupInvite from "../entities/groupInvite"
import endPoint from "../config/endpoints.config"
import nodemailer from "../services/nodemailer"

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
                     const { name, description } = req.body
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

                     const { userId, userRole } = req as customRes;
                     const { groupId } = req.params;
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
              
              sendGroupInvite: async (req: Request, res: Response, next: NextFunction) => {
                     const { groupId } = req.params;
                     const { invitees } = req.body
                     interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }

                     const { userData, userId, userRole } = req as customRes;
                     try {
                            const isGroup = await group.findById(groupId)
                            const isModerator = await group.findOne({ _id: groupId, moderators: { $in: [userId] } })
                            if (!isGroup) { return next(new customError("Group doesnt exist or disabled by admin")) }
                            if (isModerator || isGroup.admin.toString() === userId) {
                                   invitees.forEach(async (invite: string) => {
                                          const singleInvite = await groupInvite.create({ group: groupId, invitee: invite });
                                          const inviteToken = await singleInvite.getToken()
                                          const url = `${req.protocol}://${req.baseUrl}/checkVerifyEmailToken/${inviteToken}`;

                                          // send welcome mail
                                          await nodemailer(userData.email, endPoint.contactAddress, `You have been invited to collaborate in the ${isGroup.name}
                                   kindly click on  'accept invite' below to get started`, url, "accept invite")
                                   });

                                   successResponse(res, undefined, 200, "Groups invite sent  successfully to user email")
                            }
                            else { return next(new customError("Only admins or moderatore can send out group invite", 403)) }

                     } catch (err: any) {

                            return next(
                                   new customError(

                                          err.message, 500
                                   )
                            );
                     }
              },
              verifyGroupInvite: async (req: Request, res: Response, next: NextFunction) => {
                     interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }
                     const { userId } = req as customRes;
                     const { inviteToken } = req.params;

                     try {

                            const isInvited = await groupInvite.findOne({ invitee: userId, token: inviteToken, $gte: { expires: new Date(Date.now()) } })
                            if (!isInvited) { return next(new customError("Invite token expired or does not exist", 403)) }
                            else {
                                   await groupInvite.findByIdAndDelete(isInvited._id)
                                   successResponse(res, undefined, 200, "Group invite verified successfully")
                            }

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
import { Response, Request, NextFunction } from "express"
import successResponse from "../helpers/success.response"
import { customError } from "../helpers/customError"
import group from "../entities/Groups"
import { ObjectId } from "mongoose"

const appGroup = {

       createGroup: async (req: Request, res: Response, next: NextFunction) => {
              interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }
              const { name, description } = req.body

              const { userId } = req as customRes;
              try {
                     console.log(name)
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
                                                 members: [...isGroup.members, ...members],
                                                 name, description, moderators: [...isGroup.moderators, ...moderators]
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
              const { userId, userRole } = req as customRes;
              try {

                     const isGroup = await group.findById(groupId)


                     if (!isGroup) { return next(new customError("Group doesnt exist or disabled by admin", 404)) }

                     if (userRole === "ADMIN" || isGroup.admin.toString() === userId) {
                            await group.findByIdAndDelete(groupId)
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


}
export default appGroup
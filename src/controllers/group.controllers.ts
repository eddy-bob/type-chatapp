import { Response, Request, NextFunction } from "express";
import successResponse from "../helpers/success.response";
import { customError } from "../helpers/customError";
import group from "../entities/Groups";
import { ObjectId } from "mongoose";
import { format } from "../utils/formatMessage";
import groupInvite from "../entities/groupInvite";
import endPoint from "../config/endpoints.config";
import nodemailer from "../services/nodemailer";
import GroupMessages from "../entities/GroupMessages";
import User from "../entities/User";
import uploadPhoto from "../utils/uploadPhoto";
const groupFunc = () => {
  return {
    createGroup: async (req: Request, res: Response, next: NextFunction) => {
      interface customRes extends Request {
        userId: ObjectId;
        userData: any;
        userRole: string;
      }
      const { name, description, members } = req.body;
      const failedMail: any[] = [];
      const { userId } = req as customRes;
      try {
        console.log(members);

        const newGroup = await group.create({
          name,
          description,
          admin: userId,
          members: [userId],
        });
        if (newGroup) {
          members.forEach(async (invite: string) => {
            let mem = await User.findById(invite);
            if (!mem) {
              failedMail.push(mem);
            } else {
              const singleInvite = await groupInvite.create({
                group: newGroup._id,
                invitee: invite,
              });
              const inviteToken = await singleInvite.getToken();
              await groupInvite.findByIdAndUpdate(
                singleInvite._id,
                { inviteToken, expires: new Date(Date.now()) },
                { runValidators: true, new: true }
              );

              const url = `${req.protocol}://${endPoint.baseUrl}/group-chat/${inviteToken}`;

              await nodemailer(
                mem.email,
                endPoint.contactAddress,
                `You have been invited to collaborate in  ${newGroup.name}
                                          kindly click on  'accept invite' below to get started`,
                "Group Invite",
                url,
                "accept invite"
              );
            }
          });
          // send invite mail
          // members.forEach(async (member: string) => {
          //        let mem = await User.findById(member)
          //        if (!mem) { failedMail.push(mem) } else {
          //               await nodemailer(mem.email, endPoint.contactAddress, "Group Invite", `You have been invited to collaborate in  ${newGroup.name}
          //        kindly click on  'accept invite' below to get started`, url, "accept invite")
          //        }

          // });
        }

        await newGroup.save();
        if (failedMail[0]) {
          res
            .status(200)
            .send({
              data: newGroup,
              failedInvite: failedMail,
              message:
                "Group created successfully but couldnt send invite to all requested users because they not exist ",
            });
        } else {
          successResponse(res, newGroup, 200, "Group created successfully");
        }
      } catch (err: any) {
        return next(new customError(err.message, 500));
      }
    },

    updateGroup: async (req: Request, res: Response, next: NextFunction) => {
      interface customRes extends Request {
        userId: ObjectId;
        userData: any;
        userRole: string;
      }
      const { groupId } = req.params;
      const { name, description } = req.body;
      const { userId, userRole } = req as customRes;
      try {
        const isGroup = await group.findById(groupId);
        if (!isGroup) {
          return next(
            new customError("Group doesnt exist or disabled by admin", 404)
          );
        }

        if (
          userRole === "ADMIN" ||
          isGroup.admin.toString() === userId ||
          isGroup.moderators.includes(userId)
        ) {
          const newGroup = await group.findByIdAndUpdate(
            groupId,
            {
              $set: {
                name,
                description,
              },
            },
            { runValidators: true, new: true }
          );
          await newGroup.save();
          successResponse(res, newGroup, 200, "Group updated successfully");
        } else {
          return next(
            new customError(
              "only moderators and  administrators may update this group"
            )
          );
        }
      } catch (err: any) {
        return next(new customError(err.message, 500));
      }
    },
    uploadGroupPhoto: async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      interface customRes extends Request {
        userId: ObjectId;
        userData: any;
        userRole: string;
      }

      const { userId, userRole } = req as customRes;
      const { photo } = req.body;
      const { groupId } = req.params;
      try {
        const isGroup = await group.findById(groupId);
        if (!isGroup) {
          return next(
            new customError("Group doesnt exist or disabled by admin", 404)
          );
        }

        if (
          userRole === "ADMIN" ||
          isGroup.admin.toString() === userId.toString() ||
          isGroup.moderators.includes(userId)
        ) {
          // upload image to cloudinary
          if (!photo) {
            return next(new customError("Group photo is required", 400));
          }

          const image = await uploadPhoto(photo);
          const updateGroup = await group.findByIdAndUpdate(groupId, {
            $set: {
              photo: {
                name: image.name,
                mimeType: image.type,
                size: image.size,
                url: image.url,
              },
            },
          });

          successResponse(
            res,
            updateGroup,
            200,
            "Group photo updated Successfully"
          );
        } else {
          return next(
            new customError(
              "only moderators and  administrators may update this group"
            )
          );
        }
      } catch (err: any) {
        return next(new customError(err.message, 500));
      }
    },
    deleteGroup: async (req: Request, res: Response, next: NextFunction) => {
      interface customRes extends Request {
        userId: ObjectId;
        userData: any;
        userRole: string;
      }
      const { groupId } = req.params;

      const { userId, userRole } = req as customRes;
      try {
        const isGroup = await group.findById(groupId);

        if (!isGroup) {
          return next(
            new customError("Group doesnt exist or disabled by admin", 404)
          );
        }

        if (userRole === "ADMIN" || isGroup.admin.toString() === userId) {
          const isGroup = await group.findByIdAndDelete(groupId);

          // if (isGroup) {
          //        socket.leave(isGroup.name)
          //        socket.emit("leaveGroup", "You have successfully left " + isGroup.name)
          //        socket.broadcast.to(isGroup.name).emit("groupLeaveSuccess", format(`${userData.firstName} ${userData.lastName}`, " group"))
          // }

          successResponse(res, undefined, 200, "Group deleted successfully");
        } else {
          return next(
            new customError("only administrators may delete this group")
          );
        }
      } catch (err: any) {
        return next(new customError(err.message, 500));
      }
    },

    getGroup: async (req: Request, res: Response, next: NextFunction) => {
      interface customRes extends Request {
        userId: ObjectId;
        userData: any;
        userRole: string;
      }

      const { userId } = req as customRes;
      const { groupId } = req.params;
      try {
        const isGroup = await group.findOne({
          _id: groupId,
          members: { $in: [userId] },
        });
        if (!isGroup) {
          return next(
            new customError("Group doesnt exist or disabled by admin", 404)
          );
        }

        successResponse(res, isGroup, 200, "Group fetched successfully");
      } catch (err: any) {
        return next(new customError(err.message, 500));
      }
    },

    getGroups: async (req: Request, res: Response, next: NextFunction) => {
      try {
        interface customRes extends Request {
          userId: ObjectId;
          userData: any;
          userRole: string;
        }

        const { userId, userRole } = req as customRes;

        const groups = await group
          .find({ members: { $in: [userId] } })
          .sort({ name: 1 });
        successResponse(res, groups, 200, "Groups fetched successfully");
      } catch (err: any) {
        return next(new customError(err.message, 500));
      }
    },

    sendGroupInvite: async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const { groupId } = req.params;
      const { invitees } = req.body;
      interface customRes extends Request {
        userId: ObjectId;
        userData: any;
        userRole: string;
      }

      const { userData, userId } = req as customRes;
      try {
        const isGroup = await group.findById(groupId);
        const isModerator = await group.findOne({
          _id: groupId,
          moderators: { $in: [userId] },
        });
        if (!isGroup) {
          return next(
            new customError("Group doesnt exist or disabled by admin")
          );
        }
        if (isModerator || isGroup.admin.toString() === userId.toString()) {
          invitees.forEach(async (invite: string) => {
            const singleInvite = await groupInvite.create({
              group: isGroup._id,
              invitee: invite,
            });
            const inviteToken = await singleInvite.getToken();

            await singleInvite.findByIdAndUpdate(
              singleInvite._id,
              { inviteToken, expires: new Date(Date.now()) },
              { runValidators: true, new: true }
            );

            const url = `${req.protocol}://${endPoint.baseUrl}/group-home/${inviteToken}`;

            // send invite mail
            await nodemailer(
              userData.email,
              endPoint.contactAddress,
              `You have been invited to collaborate in  ${isGroup.name}
                                   kindly click on  'accept invite' below to get started`,
              "Group Invite",
              url,
              "accept invite"
            );
          });

          successResponse(
            res,
            undefined,
            200,
            "Groups invite sent  successfully to user email"
          );
        } else {
          return next(
            new customError(
              "Only admins or moderators can send out group invite",
              403
            )
          );
        }
      } catch (err: any) {
        return next(new customError(err.message, 500));
      }
    },
    verifyGroupInvite: async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      interface customRes extends Request {
        userId: ObjectId;
        userData: any;
        userRole: string;
      }
      const { userId } = req as customRes;
      const { inviteToken } = req.params;

      try {
        const isInvited = await groupInvite.findOne({
          invitee: userId,
          inviteToken: inviteToken,
          expires: { $gt: new Date(Date.now()) },
        });
        if (!isInvited) {
          return next(
            new customError("Invite token expired or does not exist", 403)
          );
        } else {
          await groupInvite.findByIdAndDelete(isInvited._id);
          successResponse(
            res,
            undefined,
            200,
            "Group invite verified successfully"
          );
        }
      } catch (err: any) {
        return next(new customError(err.message, 500));
      }
    },

    joinGroup: async (
      data: any,
      socket: any,
      userId: ObjectId,
      userData: any,
      userFullName: string
    ) => {
      try {
        const isGroup = await group.findById(data.groupId);

        if (!isGroup) {
          return socket.emit("groupError", {
            message: "Group does not exist or disabled by admin",
            statusCode: 404,
          });
        }
        if (isGroup.members.includes(userId)) {
          return socket.emit("groupError", {
            message: "You are already in this group",
            statusCode: 400,
          });
        }

        const updatedGroup = await group.findByIdAndUpdate(
          data.groupId,
          { $push: { members: userId } },
          { new: true, runValidators: true }
        );

        if (updatedGroup) {
          socket.join(isGroup.name);
          // send notification to group and persist
          await GroupMessages.insertMany([
            {
              $push: { hideFrom: userId },
              group: data.groupId as unknown as ObjectId,
              message: `${userFullName} joined group`,
            },
            {
              $pushAll: {
                hideFrom: [{ "isGroup.$.members": { $nin: [userId] } }],
              },

              group: data.groupId as unknown as ObjectId,
              message: ``,
            },
          ]);

          socket.emit(
            "joinGroupSuccess",
            format(isGroup.name + "Bot", "Welcome to " + isGroup.name)
          );
          socket
            .in(isGroup.name)
            .emit(
              "groupJoin",
              format(
                `${userData.firstName} ${userData.lastName}`,
                "joined group"
              )
            );
        }
      } catch (err: any) {
        return socket.emit("groupError", {
          message: err.message,
          statusCode: 500,
        });
      }
    },
    leaveGroup: async (
      data: any,
      socket: any,
      userId: ObjectId,
      userData: any,
      userFullName: string
    ) => {
      try {
        const isGroup = await group.findOne({
          _id: data.groupId,
          members: { $in: [userId] },
        });

        if (!isGroup) {
          return socket.emit("groupError", {
            message: "Group doesnt exist or disabled by admin",
            statusCode: 404,
          });
        }

        await group.findByIdAndUpdate(
          data.groupId,
          { $pull: { members: userId } },
          { new: true, runValidators: true }
        );

        socket.leave(isGroup.name);
        // send notification to group and persist
        await GroupMessages.create({
          group: data.groupId as unknown as ObjectId,
          message: `${userFullName} left group`,
        });
        socket.emit("leaveGroupSuccess", {
          message: "You left" + isGroup.name,
          statusCode: 200,
        });
        socket.broadcast
          .to(isGroup.name)
          .emit(
            "groupLeave",
            format(`${userData.firstName} ${userData.lastName}`, "joined group")
          );
      } catch (err: any) {
        socket.emit("groupError", { message: err.message, statusCode: 500 });
      }
    },
  };
};
export default groupFunc;

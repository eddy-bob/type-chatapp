import PrivateChat from "../entities/PrivateMessages";
import Friend from "../entities/Friend";
import { ObjectId } from "mongoose";
const mongoose = require("mongoose");
import { customError } from "../helpers/customError";
import { format } from "../utils/formatMessage";
import { NextFunction, Request, Response } from "express";
import successResponse from "../helpers/success.response";
import Group from "../entities/Groups";
import groupMessage from "../entities/GroupMessages";
import User from "../entities/User";
import friend from "../entities/Friend";
const privateChat = {
  forwardMessage: async (
    data: any,
    socket: any,
    userId: ObjectId,
    userData: any,
    userFullName: string,
    io: any
  ) => {
    try {
      const isMessage = await PrivateChat.findOne(data.messageId);
      if (!isMessage) {
        return socket.emit("forwardfail", {
          statusCode: 400,
          message: `message to forward doesnt exist or deleted`,
        });
      }
      data.recipients.forEach(
        async (recipient: { clientId: string; id: string }) => {
          const isGroup = await Group.findOne({
            _id: recipient.id,
            members: { $in: [userId] },
          });
          const isUser = await User.findById(recipient.id);
          if (isGroup) {
            const isSent = await groupMessage.create({
              owner: userId,
              message: isMessage.message,
              group: recipient,
              forwarded: true,
            });
            if (isSent) {
              io.in(isGroup.name).emit(
                "newGroupMessage",
                format(userFullName, isMessage.message)
              );
            } else {
              return socket.emit("forwardfail", {
                statusCode: 500,
                message: `group message forward to ${isGroup.name} failed`,
              });
            }
          } else if (isUser) {
            const isFriend = await friend.findOne({
              owner: recipient.id,
              friend: userId,
              blocked: false,
            });
            if (!isFriend) {
              return socket.emit("forwardfail", {
                statusCode: 401,
                message: `private message forward to isUser.firstName} ${isUser.lastName} failed because you are not friends with the requested user`,
              });
            }

            const sent = await PrivateChat.create({
              sender: userId,
              reciever: recipient.id,
              message: isMessage.message,
              forwarded: true,
            });

            if (sent) {
              io.to(recipient.clientId).emit(
                "newMessage",
                format({ name: userFullName, id: socket.id }, isGroup.message)
              );
            } else {
              return socket.emit("forwardfail", {
                statusCode: 500,
                message: `private message forward to ${isUser.firstName} ${isUser.lastName} failed`,
              });
            }
          }
        }
      );
    } catch (err: any) {
      return socket.emit("forwardFail", {
        message: err.message,
        statusCode: 500,
      });
    }
  },
  addChat: async (
    socket: any,
    data: any,
    userId: ObjectId,
    io: any,
    userFullName: string,
    con: any
  ) => {
    try {
      // const isRelationship = await Friend.findById(
      //   mongoose.Types.ObjectId(data.relationshipId)
      // );
      // console.log("isRelationship:", isRelationship, data.relationshipId);

      const isFriend = await Friend.findOne({
        friend: mongoose.Types.ObjectId(userId),
        owner: mongoose.Types.ObjectId(data.userId),
        blocked: false,
      });

      console.log(isFriend);
      // if (!isRelationship) {
      //   return socket.emit("chatError", {
      //     message: "You are not friends with this person",
      //     statusCode: 403,
      //   });
      // }

      if (!isFriend) {
        return socket.emit("chatError", {
          message: "You are not friends with this person",
          statusCode: 403,
        });
      }
      if (isFriend && isFriend.blocked == true) {
        return socket.emit("chatError", {
          message: "You blocked this user",
          statusCode: 401,
        });
      }

      const newMessage = await PrivateChat.create({
        message: data.message,
        senderName: userFullName,
        attatchment: data.attatchment,
        sender: userId,
        reciever: data.userId,
      });
      if (!newMessage) {
        return socket.emit("chatError", {
          message: "could not send message",
          statuseCode: 500,
        });
      }
      console.log(newMessage);
      socket.emit(
        "myMessage",
        format(
          {
            chatId: newMessage._id,
            senderName: userFullName,
            sender: userId,
            attatchment: data.attatchment,
            status: "DELIEVERED",
          },
          data.message
        )
      );
      socket.to(con[[data.userId] as any]).emit(
        "newMessage",
        format(
          {
            chatId: newMessage._id,
            senderName: userFullName,
            sender: userId,
            attatchment: data.attatchment,
          },
          data.message
        )
      );
      socket.on("read", (data: { chatId: ObjectId }) => {});
    } catch (err: any) {
      socket.emit("ChatError", { message: err.message, statusCode: 500 });
    }
  },
  getChats: async (req: Request, res: Response, next: NextFunction) => {
    console.log("get chat ooo")
    interface customRes extends Request {
      userId: ObjectId;
      userData: any;
      userRole: string;
    }
    const { friendId } = req.query;

   
    const { userId, userRole } = req as customRes;
    try {
      console.log(friendId)
      if(!friendId){
        return  successResponse(res,undefined, 200, "Chats fetched succesfully");
      }
      // const isFriend = await Friend.findOne({
      //        owner: friendId,
      //        friend: userId,
      //        blocked: false
      // })
      // console.log(isFriend)
      
      
      // if (!isFriend && userRole !== "ADMIN") { return next(new customError("you are not friends with this person", 403)) }
      const chats = await PrivateChat.find({
        $or: [
          { sender: friendId, reciever: userId },
          { sender: userId, reciever: friendId },
        ],
        hideFrom: { $ne: userId },
      });
     

      successResponse(res, chats, 200, "Chats fetched succesfully");
    } catch (err: any) {
      next(new customError(err.message, 500));
    }
  },
  readChat: async (data: { chat: ObjectId }) => {
    try {
      await PrivateChat.populate();
    } catch (err: any) {
      //        socket.emit("ChatError",
      //               { message: err.message, statusCode: 500 })
      // }
    }
  },
  deleteChat: async (req: Request, res: Response, next: NextFunction) => {
    interface customRes extends Request {
      userId: ObjectId;
      userData: any;
      userRole: string;
    }
    const { chatId } = req.params;
    const { userId, userRole } = req as customRes;
    try {
      const isChat = await PrivateChat.findById(chatId);
      if (!isChat) {
        return next(new customError("Chat doesnt exist", 404));
      }
      if (userRole === "ADMIN" || isChat.sender.toString() === userId) {
        await PrivateChat.findByIdAndDelete(chatId);
      } else {
        PrivateChat.findByIdAndUpdate(chatId, { $set: { hideFrom: userId } });
      }
      successResponse(res, undefined, 201, "message deleted successfully");
    } catch (err: any) {
      next(new customError(err.message, 500));
    }
  },
};
export default privateChat;

import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongoose";
import Friend from "../entities/Friend";
import User from "../entities/User";
const mongoose = require("mongoose");
import Video from "../entities/Call";
import { Type } from "../entities/Call";
import { customError } from "../helpers/customError";
import successResponse from "../helpers/success.response";

const video = {
  startVideoCall: async (
    socket: any,
    io: any,
    userId: ObjectId,
    userFullName: string,
    id: string,
    socketReference: string,
    peerId: string
  ) => {
    try {
      const isUser = await User.findById(mongoose.Types.ObjectId(id));
      console.log(isUser);

      const isFriend = await Friend.findOne({
        friend: mongoose.Types.ObjectId(userId),
        owner: mongoose.Types.ObjectId(id),
        blocked: false,
      });

      console.log(isFriend);
      if (!isUser) {
        return socket.emit("private_video_call_init_fail", {
          message: "User does not exist or disabled",
          statusCode: 404,
        });
      }

      if (!isFriend) {
        return socket.emit("private_video_call_init_fail", {
          message: "You are not friends with this person",
          statusCode: 401,
        });
      }
      console.log("it passed this place jare");

      const callRecord = await Video.create({
        caller: userId,
        callerName: userFullName,
        reciever: mongoose.Types.ObjectId(id),
        type: Type.VIDEO,
      });

      console.log(callRecord);
      socket.emit("private_video_call_inverse_init", {
        callerId: userId,
        name: userFullName,
        peerId,
        callId: callRecord._id,
      });
      socket.to(socketReference).emit("private_video_call_init", {
        callerId: userId,
        name: userFullName,
        peerId,
        callId: callRecord._id,
      });

      // socket.emit("private_video_call_inverse_init", {
      //   recieverId: id,
      //   name: userFullName,
      // });
    } catch (err: any) {
      socket.emit("private_video_call_init_fail", {
        message: "Unable to process call",
      });
    }
  },
  // getVideoCalls: async (req: Request, res: Response, next: NextFunction) => {
  //   interface customRes extends Request {
  //     userId: ObjectId;
  //     userData: any;
  //   }

  //   const { userId } = req as customRes;

  //   try {
  //     const calls = await Video.find({
  //       $or: [{ caller: userId }, { reciever: userId }],
  //     });

  //     successResponse(res, calls, 200, "Video calls fetched  successfully");
  //   } catch (err: any) {
  //     next(new customError(err.message, err.statusCode || 500));
  //   }
  // },

  updateCallStatus: async (
    socket: any,
    io: any,
    recieverId: ObjectId,
    callId: ObjectId,
    userFullName: string,
    userId: any,
    inverseReference: any,
    data: {
      status: string;
      callerId: ObjectId;
      socketReference: string;
      callerName: string;
      peerId: string;
    }
  ) => {
    try {
      console.log("it entered here", callId);
      let calls;
      calls = await Video.findById(mongoose.Types.ObjectId(callId));

      if (!calls) {
        return socket.emit("private_video_call_action_error", {
          statusCode: 404,
          message: "Call record does not exist",
        });
      }
      // if (!calls && data.callerId === userId) {
      //    socket.emit("private_video_call_end_success", {
      //     message: "Call ended successfully",
      //   });
      //   return socket
      //     .to(data.socketReference)
      //     .emit("private_video_call_end_inverse_success", {
      //       message: "Call ended successfully",
      //     });
      // }
      console.log(calls);
      if (data.status === "ENDED" || data.status === "MISSED") {
        console.log("endeddddddd");
        console.log(calls.caller, userId);

        if (data.status === "ENDED") {
          if (
            calls.reciever.equals(mongoose.Types.ObjectId(userId)) ||
            calls.caller.equals(mongoose.Types.ObjectId(userId))
          ) {
            console.log("got to end call check");
            await calls.updateOne(
              { status: data.status },
              { new: true, validate: true }
            );
            console.log("got to end call");

            if (calls.caller.equals(mongoose.Types.ObjectId(userId))) {
              console.log("i am the caller trying to end the call");
              socket.emit("private_video_call_end_success", {
                message: "Call ended successfully",
              });

              socket
                .to(inverseReference)
                .emit("private_video_call_end_inverse_success", {
                  message: "Call ended successfully",
                });
            } else {
              console.log("i am the reciever trying to end the call");
              if (calls.reciever.equals(mongoose.Types.ObjectId(recieverId))) {
                socket.leave(data.callerId);
              }
              socket.emit("private_video_call_end_success", {
                message: "Call ended successfully",
              });
              return socket
                .to(data.socketReference)
                .emit("private_video_call_end_inverse_success", {
                  message: "Call ended successfully",
                });
            }
          } else {
            return socket.emit("private_video_call_action_error", {
              statusCode: 403,
              message: "Only a call reciever or caller can end call",
            });
          }
        } else {
          socket
            .to(data.socketReference)
            .emit("private_video_call_missed_notify", {
              message: `Video call not answered`,
            });
          return socket.emit("private_video_call_not_answered", {
            message: `Video call ${data.status.toLowerCase()}`,
          });
        }
      }

      if (
        calls.reciever.equals(mongoose.Types.ObjectId(recieverId)) &&
        (data.status === "ACCEPTED" || data.status === "REJECTED")
      ) {
        console.log("reciver gat this");
        await calls.updateOne({ status: data.status }, { validate: true });
        if (data.status === "ACCEPTED") {
          console.log("accept region");
          socket.join(data.callerId);

          socket.emit("private_video_call_authorize", {
            callerId: data.callerId,
            name: data.callerName,
            peerId: data.peerId,
            callId,
          });
          return socket
            .to(data.socketReference)
            .emit("private_video_call_inverse_authorize", {
              callerId: data.callerId,
              name: data.callerName,
              peerId: data.peerId,
              callId,
            });
          // socket.broadcast
          //   .to(data.callerId)
          //   .emit("private_video_call_authorized", {
          //     recieverId: userId,
          //     name: userFullName,
          //   });
        } else {
          socket.emit("private_video_call_reject_success", {
            callerId: data.callerId,
            name: data.callerName,
            message: "Call rejected successfully",
          });
          return socket
            .to(data.socketReference)
            .emit("private_video_call_reciever_rejected", {
              recieverId: recieverId,
              name: userFullName,
              message: "reciever rejected call",
            });
        }
      } else {
        socket.emit("private_video_call_action_error", {
          statusCode: 403,
          message: "Only a call reciever can reject or accept a call",
        });
      }
    } catch (err: any) {
      socket.emit("private_video_call_action_error", {
        statusCode: err.statusCode || 500,
        message: err.message || "Couldnt carry out video call action",
      });
    }
  },
};
export default video;

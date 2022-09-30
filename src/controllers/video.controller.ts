import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongoose";
import Friend from "../entities/Friend";
import User from "../entities/User";
const mongoose = require("mongoose");
import Video from "../entities/VideoCall";
import { customError } from "../helpers/customError";
import successResponse from "../helpers/success.response";

const video = {
  startVideoCall: async (
    socket: any,
    io: any,
    userId: ObjectId,
    userFullName: string,
    id: string,
    socketReference: string
  ) => {
    try {
      const isUser = await User.findById(mongoose.Types.ObjectId(id));

      const isFriend = await Friend.findOne({
        friend: mongoose.Types.ObjectId(userId),
        owner: mongoose.Types.ObjectId(id),
        blocked: false,
      });

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

      await Video.create({
        caller: userId,
        callerName: userFullName,
        reciever: mongoose.Types.ObjectId(id),
      });
      io.to(socketReference).emit("private_video_call_init", {
        callerId: userId,
        name: userFullName,
      });
      socket.emit("private_video_call_inverse_init", {
        recieverId: id,
        name: userFullName,
      });
    } catch (err: any) {
      socket.emit("private_video_call_init_fail", {
        message: "Unable to process call",
      });
    }
  },
  getVideoCalls: async (req: Request, res: Response, next: NextFunction) => {
    interface customRes extends Request {
      userId: ObjectId;
      userData: any;
    }

    const { userId } = req as customRes;

    try {
      const calls = await Video.find({
        $or: [{ caller: userId }, { reciever: userId }],
      });

      successResponse(res, calls, 200, "Video calls fetched  successfully");
    } catch (err: any) {
      next(new customError(err.message, err.statusCode || 500));
    }
  },
  updateCallStatus: async (
    socket: any,
    io: any,
    userId: ObjectId,
    callId: ObjectId,
    userFullName: string,
    data: {
      status: string;
      callerId: ObjectId;
      socketReference: string;
      callerName: string;
    }
  ) => {
    try {
      let calls;
      calls = await Video.findById(mongoose.Types.ObjectId(callId));
      if (!calls) {
        socket.emit("private_video_call_action_error", {
          statusCode: 404,
          message: "Call record does not exist",
        });
      }

      if (data.status === "ENDED" || data.status === "MISSED") {
        if (
          calls.reciever === mongoose.Types.ObjectId(userId) ||
          calls.caller === mongoose.Types.ObjectId(userId)
        ) {
          await calls.update(
            { status: data.status },
            { new: true, validate: true }
          );
          socket.emit("private_video_call_end_success", {
            message: "Call ended successfully",
          });
          io.to(data.socketReference).emit(
            "private_video_call_end_inverse_success",
            {
              message: "Call ended successfully",
            }
          );
        } else {
          socket.emit("private_video_call_action_error", {
            statusCode: 403,
            message: "Only a call reciever or caller can end call",
          });
        }
      } else if (calls.reciever === mongoose.Types.ObjectId(userId)) {
        await calls.update({ status: data.status }, { validate: true });
        if (data.status === "ACCEPTED") {
          io.to(data.socketReference).emit(
            "private_video_call_reciever_answer",
            {
              recieverId: userId,
              name: userFullName,
            }
          );
          socket.emit("private_video_call_answer_success", {
            callerId: data.callerId,
            name: data.callerName,
          });
        } else {
          socket.emit("private_video_call_reject_success", {
            callerId: data.callerId,
            name: data.callerName,
            message: "Call rejected successfully",
          });
          io.to(data.socketReference).emit(
            "private_video_call_reciever_reject",
            {
              callerId: userId,
              name: userFullName,
              message: "Call rejected successfully",
            }
          );
        }
      } else {
        socket.emit("private_video_call_action_error", {
          statusCode: 403,
          message: "Only a call reciever can reject or accept a call",
        });
      }
      socket.to(data.socketReference).emit("private_video_call_missed_notify", {
        message: `Video call ${data.status.toLowerCase()}`,
      });
      socket.emit("private_video_call_not_answered", {
        message: `Video call ${data.status.toLowerCase()}`,
      });
    } catch (err: any) {
      socket.emit("private_video_call_action_error", {
        statusCode: err.statusCode || 500,
        message: err.message || "Couldnt carry out video call action",
      });
    }
  },
};
export default video;

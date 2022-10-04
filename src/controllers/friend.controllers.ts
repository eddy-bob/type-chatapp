import { NextFunction, Request, Response } from "express";

import { ObjectId } from "mongoose";
import Friend from "../entities/Friend";
import { customError } from "../helpers/customError";
import successResponse from "../helpers/success.response";

const friend = {
  blockFriend: async (req: Request, res: Response, next: NextFunction) => {
    interface customRes extends Request {
      userId: ObjectId;
      userData: any;
      userRole: string;
    }
    const { friendId } = req.params;
    const { userId } = req as customRes;

    try {
      const isFriend = await Friend.findOne({
        friend: friendId,
        owner: userId,
      });
      if (!isFriend) {
        return next(
          new customError("You are not friends with this person", 400)
        );
      }
      if (isFriend.blocked == true) {
        return next(new customError("You already blocked this person", 400));
      }
      const blockFriend = await Friend.findByIdAndUpdate(
        isFriend._id,
        { $set: { blocked: true } },
        { new: true, runValidators: true }
      );

      successResponse(res, blockFriend, 201, "user blocked successfully");
    } catch (err: any) {
      next(new customError(err.message, 500));
    }
  },
  unblockFriend: async (req: Request, res: Response, next: NextFunction) => {
    interface customRes extends Request {
      userId: ObjectId;
      userData: any;
      userRole: string;
    }
    const { friendId } = req.params;
    const { userId } = req as customRes;

    try {
      const isFriend = await Friend.findOne({
        friend: friendId,
        owner: userId,
      });
      if (!isFriend) {
        return next(new customError("Request not found", 404));
      }
      if (isFriend.blocked == false) {
        return next(
          new customError("You are still friends with this person", 400)
        );
      }
      const blockFriend = await Friend.findByIdAndUpdate(
        isFriend._id,
        { $set: { blocked: false } },
        { new: true, runValidators: true }
      );

      successResponse(res, blockFriend, 201, "user unblocked successfully");
    } catch (err: any) {
      next(new customError(err.message, 500));
    }
  },
  getFriends: async (req: Request, res: Response, next: NextFunction) => {
    interface customRes extends Request {
      userId: ObjectId;
      userData: any;
      userRole: string;
    }

    const { userId } = req as customRes;

    try {
      const friends = await Friend.find({ owner: userId, blocked: false });
      console.log("friends", friends);
      successResponse(res, friends, 200, "Friends fetched successfully");
    } catch (err: any) {
      next(new customError(err.message, 500));
    }
  },
};
export default friend;

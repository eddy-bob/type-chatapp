import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongoose";
import Friend from "../entities/Friend";
import User from "../entities/User";
const mongoose = require("mongoose");
import Video from "../entities/Call";
import { Type } from "../entities/Call";
import { customError } from "../helpers/customError";
import successResponse from "../helpers/success.response";

const call = {
  getAllCalls: async (req: Request, res: Response, next: NextFunction) => {
    interface customRes extends Request {
      userId: ObjectId;
      userData: any;
    }

    const { userId } = req as customRes;

    try {
      const calls = await Video.find({
        $or: [{ caller: userId }, { reciever: userId }],
      });

      successResponse(res, calls, 200, "Call records fetched  successfully");
    } catch (err: any) {
      next(new customError(err.message, err.statusCode || 500));
    }
  },
};
export default call;

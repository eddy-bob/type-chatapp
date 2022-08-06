import { Response, Request, NextFunction } from "express";
import successResponse from "../helpers/success.response";
import { customError } from "../helpers/customError";
import RecentChat from "../entities/RecentPrivateChat";
;
import { ObjectId } from "mongoose";


const recentChat = {
       getRecentChats: async (req: Request, res: Response, next: NextFunction) => {

              interface customRes extends Request {
                     userId: ObjectId;
                     userData: any;
                     userRole: string;
              }

              const { userId } = req as customRes;
              try {
                     const chats = await RecentChat.find({ owner: userId }).sort({ created_at: -1 })
                     return successResponse(res, chats, 200, "Recent chats fetched successfully")

              } catch (err: any) {
                     next(new customError(err.message, 500));
              }
       },

       addRecentChat: async (req: Request, res: Response, next: NextFunction) => {

              interface customRes extends Request {
                     userId: ObjectId;
                     userData: any;
                     userRole: string;
              }

              const { userId } = req as customRes;
              try {

                     await RecentChat.deleteOne({ owner: userId, friend: req.body.friendId })
                     const chats = await RecentChat.create({ owner: userId, friend: req.body.friendId })
                     return successResponse(res, chats, 200, "Recent chats created successfully")

              } catch (err: any) {
                     next(new customError(err.message, 500));
              }
       },




};
export default recentChat;

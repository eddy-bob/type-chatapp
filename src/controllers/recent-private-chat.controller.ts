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
                     const chats = await RecentChat.find({ owner: userId }).sort({ createdAt: -1 })
                     console.log(chats)
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
                     console.log(req.body)
                     await RecentChat.deleteOne({ owner: userId, friend: req.body.friend })
                     await RecentChat.deleteOne({ friend: userId, owner: req.body.friend })

                     const chats = await RecentChat.create({ owner: userId, friend: req.body.friend, relationship: req.body.relationship })
                     await chats.save()
                     console.log("e reach ooooo")
                     const reverseChats = await RecentChat.create({ owner: req.body.friend, friend: userId, relationship: req.body.relationship })
                     await reverseChats.save()
                     console.log(chats, "na recent be this")
                     const recentChats= await RecentChat.find({ owner: userId }).sort({ createdAt: -1 })
                     return successResponse(res, recentChats, 200, "Recent chats created successfully")

              } catch (err: any) {
                     next(new customError(err.message, 500));
              }
       },




};
export default recentChat;

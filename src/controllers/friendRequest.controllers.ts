import { Response, Request, NextFunction } from "express"
import successResponse from "../helpers/success.response"
import { customError } from "../helpers/customError"
import FriendRequest from "../entities/FriendRequest"
import User from "../entities/User"
import Friend from "../entities/Friend"
import { ObjectId } from "mongoose"

const friendRequest = {

       sendRequest: async (req: Request, res: Response, next: NextFunction) => {
              const { id } = req.params
              interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }

              const { userId } = req as customRes;
              try {

                     const user = await User.findById(id)

                     const alreadySent = await FriendRequest.findOne({ reciever: id, PendingFriend: userId })

                     if (alreadySent) { return next(new customError("Request already sent", 400)) }
                     if (!user) { return next(new customError("requested user does not exist or disabled by admin", 404)) }

                     const newReq = await FriendRequest.create({ reciever: user._id, PendingFriend: userId })

                     successResponse(res, newReq, 200, "Request sent succesfully")
              } catch (err: any) {
                     next(new customError(err.message, 500))
              }
       },

       acceptRequest: async (req: Request, res: Response, next: NextFunction) => {
              const { requestId } = req.params
              interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }
              const { userId } = req as customRes;


              try {
                     const isRequest = await FriendRequest.findById(requestId)

                     if (!isRequest) { return next(new customError("request does not exist", 404)) }

                     const acceptFriend = await Friend.create({ owner: userId, friend: isRequest.PendingFriend })
                     await Friend.create({ friend: userId, owner: isRequest.PendingFriend })

                     await FriendRequest.findByIdAndDelete(isRequest._id)
                     successResponse(res, acceptFriend, 200, "Friend request accepted successfully")

              } catch (err: any) {
                     next(new customError(err.message, 500))
              }
       },

       rejectRequest: async (req: Request, res: Response, next: NextFunction) => {
              const { requestId } = req.params

              try {
                     const isRequest = await FriendRequest.findById(requestId)
                     if (!isRequest) { return next(new customError("request does not exist", 404)) }

                     await FriendRequest.findByIdAndDelete(isRequest._id)
                     successResponse(res, undefined, 200, "Friend request rejected successfully")

              } catch (err: any) {
                     next(new customError(err.message, 500))
              }
       },
       deleteRequest: async (req: Request, res: Response, next: NextFunction) => {
              const { requestId } = req.params
              interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }
              const { userId, userRole } = req as customRes;

              try {
                     const isRequest = await FriendRequest.findById(requestId)

                     if (!isRequest) { return next(new customError("request does not exist", 404)) }
                     if (userRole === "ADMIN" || isRequest.PendingFriend.toString() === userId.toString()) {
                            await FriendRequest.findByIdAndDelete(isRequest._id)

                     }
                     else { return next(new customError("You are not authorized to delete this request", 403)) }

              } catch (err: any) {
                     next(new customError(err.message, 500))
              }


       },
       getRequests: async (req: Request, res: Response, next: NextFunction) => {
              interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }
              const { userId, userRole } = req as customRes;
              try {

                     const requests = await FriendRequest.find({ reciever: userId })
                     successResponse(res, requests, 200, "friend requests fetched successfully")

              } catch (err: any) {
                     next(new customError(err.message, 500))
              }

       }
}
export default friendRequest
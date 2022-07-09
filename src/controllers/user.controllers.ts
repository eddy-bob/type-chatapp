import { Response, Request, NextFunction } from "express"
import successResponse from "../helpers/success.response"
import { customError } from "../helpers/customError"
import User from "../entities/User"
import { ObjectId } from "mongoose"

const user = {

       getUsers: async (req: Request, res: Response, next: NextFunction) => {

              try {


                     const allUsers = await User.find({});

                     successResponse(res, allUsers, 200, "All Users Fetched Successfully")
              } catch (err: any) {

                     return next(
                            new customError(

                                   err.message, 500
                            )
                     );
              }
       },

       deleteUsers: async (req: Request, res: Response, next: NextFunction) => {

              try {



                     const allUsers = await User.deleteMany({});

                     successResponse(res, undefined, 200, "All Users Deleted Successfully")
              } catch (err: any) {

                     return next(
                            new customError(

                                   err.message, 500
                            )
                     );
              }
       },
       getProfile: async (req: Request, res: Response, next: NextFunction) => {

              try {


                     interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }

                     const { userId } = req as customRes;


                     const user = await User.findById(userId);
                     if (user) { successResponse(res, user, 200, "Profile Fetched Successfully") }
                     else { return next(new customError("Profile not found or disabled", 404)) }
              } catch (err: any) {

                     return next(
                            new customError(

                                   err.message, 500
                            )
                     );
              }
       },
       getUser: async (req: Request, res: Response, next: NextFunction) => {

              try {


                     const { id } = req.params;

                     const user = await User.findById(id);
                     if (user) { successResponse(res, user, 200, "User Fetched Successfully") }
                     else { return next(new customError("User not found or disabled", 404)) }
              } catch (err: any) {

                     return next(
                            new customError(

                                   err.message, 500
                            )
                     );
              }
       },
       searchUser: async (req: Request, res: Response, next: NextFunction) => {


              try {
                     const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                     const isEmail = re.test(String(req.query.search).toLowerCase());

                     if (isEmail == true) {
                            const user = await User.findOne({ email: req.body.search });
                            if (user) { successResponse(res, user, 200, "User Fetched Successfully") }
                            else { return next(new customError("User not found or disabled", 404)) }
                     } else {
                            let nameArr = req.body.query.split(" ")
                            const users = await User.find({
                                   $or: [{ firstName: nameArr[0], lastName: nameArr[1] },
                                   { lastName: nameArr[0], firstName: nameArr[1] }]
                            });
                            successResponse(res, user, 200, "User Fetched Successfully")

                     }


              } catch (err: any) {

                     return next(
                            new customError(

                                   err.message, 500
                            )
                     );
              }
       },
       deleteUser: async (req: Request, res: Response, next: NextFunction) => {


              try {


                     const { id } = req.params;



                     const authUser = await User.findByIdAndDelete(id);
                     if (authUser) {
                            successResponse(res, undefined, 200, "user deleted Successfully")
                     }
                     else { return next(new customError("User not found or disabled", 404)) }


              } catch (err: any) {

                     return next(
                            new customError(

                                   err.message, 500
                            )
                     );
              }
       },
       deleteAccount: async (req: Request, res: Response, next: NextFunction) => {


              try {

                     interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }

                     const { userId } = req as customRes;


                     const authUser = await User.findByIdAndDelete(userId);
                     if (authUser) {
                            successResponse(res, undefined, 200, "Account deleted Successfully")
                     }
                     else { return next(new customError("Account not found or disabled", 404)) }


              } catch (err: any) {

                     return next(
                            new customError(

                                   err.message, 500
                            )
                     );
              }
       },
       updateProfile: async (req: Request, res: Response, next: NextFunction) => {

              try {
                     interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }

                     const { userId } = req as customRes;



                     const newUser = await User.findByIdAndUpdate(userId, req.body, { runValidators: true, new: true });
                     if (newUser) { successResponse(res, newUser, 200, "Profile Updated Successfully") }
                     else { return next(new customError("User not found or disabled", 404)) }

              } catch (err: any) {

                     return next(
                            new customError(

                                   err.message, 500
                            )
                     );
              }
       },
       updateUser: async (req: Request, res: Response, next: NextFunction) => {

              try {


                     const { id } = req.params;

                     const newUser = await User.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
                     if (newUser) { successResponse(res, newUser, 200, "User Updated Successfully") }
                     else { return next(new customError("User not found or disabled", 404)) }

              } catch (err: any) {

                     return next(
                            new customError(

                                   err.message, 500
                            )
                     );
              }
       }
}
export default user
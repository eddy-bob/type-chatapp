import { Response, Request, NextFunction } from "express"
import successResponse from "../helpers/success.response"
import { customError } from "../helpers/customError"
import User from "../entities/User"

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

                     successResponse(res, undefined, 204, "All Users Deleted Successfully")
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
       deleteUser: async (req: Request, res: Response, next: NextFunction) => {


              try {


                     const { id } = req.params;

                     const user = await User.findByIdAndDelete(id);
                     if (user) {
                            successResponse(res, undefined, 204, "user deleted Successfully")
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
import { Response, Request, NextFunction } from "express"
import successResponse from "../helpers/success.response"
import { customError } from "../helpers/customError"
import User from "../entities/User"
import uploadPhoto from "../utils/uploadPhoto"
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
       uploadProfilePicture: async (req: Request, res: Response, next: NextFunction) => {
              interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }

              const { userId } = req as customRes;
              try {

                     const { photo } = req.body

                     // upload image to cloudinary
                     if (!photo) {
                            return next(
                                   new customError(

                                          "Profile picture is required", 400
                                   ))
                     }
                     const image = await uploadPhoto(photo);

                     const updateProfile = await User.findByIdAndUpdate(userId, {

                            $set: {
                                   photo: {
                                          mimeType: image.format,
                                          size: image.bytes,
                                          url: image.secure_url
                                   },
                            }
                     }, { new: true, runValidators: true });
                     console.log(updateProfile)

                     successResponse(res, updateProfile, 200, "Profile picture updated Successfully")

              } catch (err: any) {

                     return next(
                            new customError(

                                   err.message, 500
                            )
                     );
              }
       },
       uploadCoverPicture: async (req: Request, res: Response, next: NextFunction) => {
              interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }

              const { userId } = req as customRes;
              try {

                     const { coverPhoto } = req.body
                     // upload image to cloudinary
                     if (!coverPhoto) {
                            return next(
                                   new customError(

                                          "cover photo is required", 400
                                   ))
                     }
                     const image = await uploadPhoto(coverPhoto);
                     const updateProfile = await User.findByIdAndUpdate(userId, {
                            $set: {
                                   coverPhoto: {

                                          mimeType: image.format,
                                          size: image.bytes,
                                          url: image.secure_url
                                   },
                            }
                     }, { new: true, runValidators: true });

                     successResponse(res, updateProfile, 200, "Cover photo updated Successfully")
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

              interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }

              const { userId } = req as customRes;
              try {




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
                     console.log(user)
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
              type Query = { search?: string }
              const query: Query = { ...req.query };

              try {
                     const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                     const isEmail = re.test(String(req.query.search));

                     if (!req.query.search) { return next(new customError("Search not found", 404)) }
                     if (isEmail == true) {

                            const users = await User.findOne({ email: new RegExp(`^${query.search}$`, 'i') })
                            console.log(users)
                            if (users) { successResponse(res, [users], 200, "User Fetched Successfully") }
                            else { return next(new customError("User not found or disabled", 404)) }

                     } else {
                            let users;
                            let nameArr = query.search!.split(" ")
                            console.log(nameArr)
                            if (nameArr.length < 2) {

                                   users = await User.find({
                                          $or: [{ firstName: new RegExp(`^${nameArr[0]}$`, 'i') },
                                          { lastName: new RegExp(`^${nameArr[0]}$`, 'i') }]
                                   });

                            }
                            else {
                                   console.log(true)
                                   users = await User.find({
                                          $or: [{
                                                 firstName: new RegExp(`^${nameArr[0]}$`, 'i'),
                                                 lastName: new RegExp(`^${nameArr[1]}$`, 'i')
                                          },
                                          {
                                                 lastName: new RegExp(`^${nameArr[0]}$`, 'i'),
                                                 firstName: new RegExp(`^${nameArr[1]}$`, 'i')
                                          }]
                                   });
                                   console.log(users)
                            }
                            successResponse(res, users, 200, "User Fetched Successfully")

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
              interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }

              const { userId } = req as customRes;

              try {




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
              interface customRes extends Request { userId: ObjectId, userData: any, userRole: string }

              const { userId } = req as customRes;
              try {




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
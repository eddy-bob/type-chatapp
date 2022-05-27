import { Response, Request, NextFunction } from "express"
import successResponse from "../helpers/success.response"
import nodemailer from "../services/nodemailer"
import verifyEmail from "../entities/verifyEmail"
import { customError } from "../helpers/customError"
import User from "../entities/User"
import endPoint from "../config/endpoints.config"
import { ObjectId } from "mongodb"


const auth = {
       register: async (req: Request, res: Response, next: NextFunction): Promise<void> => {

              try {
                     const data = await User.create(req.body)
                     // hashpassword
                     await data.hashPassword()
                     await data.save()
                     const newUser = await User.findOne({ email: req.body.email })
                     console.log(newUser)
                     if (newUser) {
                            // create user to verify email collection
                            const emailVerification = await verifyEmail.create({
                                   user: newUser._id,
                            });
                            // get verify email token
                            const verifyEmailToken = await emailVerification.getToken();
                            await emailVerification.save();
                            const url = `${req.protocol}://www.nodechatpapp.com/checkVerifyEmailToken/${verifyEmailToken}`;
                            console.log(url)
                            // send welcome mail
                            const mail = await nodemailer(req.body.email, endPoint.contactAddress, "Welcome to type-chat-app. You are getting this mail because you have just recently opened an account with us.please disregard if you didnt.Cclick on the link below to verify your account", "Account creation", url)

                            successResponse(res, newUser, 200, "user created successfully")
                     }
                     else { return next(new customError("Failed to create user")) }
              } catch (err: any) {

                     return next(
                            new customError(

                                   err.message, 500
                            )
                     );
              }

       },
       login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {

              const { email, password } = req.body

              if (!email || !password) { return next(new customError("Email and Password required", 400)) }
              const user = await User.findOne({ email }).select("+password")
              if (!user) { return next(new customError("User not a registered User", 400)) }
              const isAuth = await user.comparePassword(password);
              console.log(isAuth)
              if (isAuth == true) {
                     const authUser = await User.findByIdAndUpdate(
                            user._id, { $set: { isLoggedIn: true } }, { runValidators: true, new: true }
                     )
                     const token = authUser.getToken()
                     successResponse(res, authUser, 201, "Signin successful", token)
              } else { return next(new customError("Sorry Email and Password did not work", 401)) }

       },

       forgotPasswordInit: async (req: Request, res: Response, next: NextFunction): Promise<void> => {


              const { email } = req.body;
              const user = await User.findOne({ email });
              if (!email) {
                     return next(new customError("please provide an email", 400));
              }
              if (!user) {
                     return next(new customError("Email not linked to any registered user", 404));
              }
              const resetToken = await user.genResetPasswordToken();
              if (!resetToken) {
                     return next(
                            new customError(

                                   "sorry something went wrong and couldnt send reset password link", 500
                            )
                     );
              }


              const subject = "forgot password";
              const message = `you requested a reset password.click on the link below to reset password .`;
              const url = `https://www.typechatapp.com/reset-password/${resetToken}`;
              const err = nodemailer(
                     email,
                     endPoint.contactAddress,
                     message,
                     subject,
                     url,

              );
              let cleanUser = await User.findOne({ email })
              successResponse(res, cleanUser, 200, "reset password link sent to email");



       },
       forgotPasswordComplete: async (req: Request, res: Response, next: NextFunction): Promise<void> => {


              const { resetPasswordToken } = req.params;
              var { newPassword, confirmPassword } = req.body;
              const userToken = await User.findOne({ resetPasswordToken, $gte: { resetPasswordExpire: new Date(Date.now()) } });

              if (!userToken) {
                     return next(new customError("token does not exist or expired"));
              }

              if (!newPassword || !confirmPassword) {
                     return next(
                            new customError("please include a newpassword and confirm password", 400)
                     );
              }
              if (newPassword !== confirmPassword) {
                     return next(new customError("passwords must match", 400));
              }

              const newUser = await User
                     .findOne({ resetPasswordToken })
                     .select("+password");
              newUser.password = newPassword;
              await newUser.hashPassword(newPassword);
              await newUser.save();

              successResponse(res, newUser, 201, "password updated successfully");
       },
       updatePassword: async (req: Request, res: Response, next: NextFunction): Promise<void> => {

              interface customRes extends Request { userId: ObjectId, userData: any }
              var { newPassword, oldPassword } = req.body;
              const { userId, userData } = req as customRes;
              if (!newPassword || !oldPassword) {
                     return next(
                            new customError("please include new password and old password", 400)
                     );
              }

              const user = await User.findById(userId).select("+password");

              const oldIsInDatabase = await user.comparePassword(oldPassword);

              // check if old password is equal to  password in database
              if (!oldIsInDatabase) {
                     return next(
                            new customError(

                                   " old  password must  be the same with previous password", 400
                            )
                     );
              }
              // check if you are repeating the same password in database with the new password
              const newIsInDatabase = await user.comparePassword(newPassword);
              if (newIsInDatabase) {
                     return next(
                            new customError(

                                   " new  password must not be the same with previous password", 400
                            )
                     );
              }
              // hash password

              const updateNewPassword = await User
                     .findByIdAndUpdate(
                            userId,
                            {
                                   $set: {
                                          password: newPassword,
                                   }
                            },
                            { new: true, runValidator: true }
                     )

              await updateNewPassword.hashPassword(newPassword);
              await updateNewPassword.save();
              const updateUser = await User.findById(userId);
              successResponse(res, updateUser, 200, "password updated successfully");
       },
       verifyEmail: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
              // create user to verify email collection
              interface customRes extends Request { userId: ObjectId, userData: any }
              const { userId } = req as customRes
              const emailVerification = await verifyEmail.create({
                     user: userId,
              });
              // get verify email token
              const verifyEmailToken = await emailVerification.getToken();
              await emailVerification.save();
              const url = `${req.protocol}://www.nodechatpapp.com/checkVerifyEmailToken/${verifyEmailToken}`;
              console.log(url)
              // send welcome mail
              const mail = await nodemailer(req.body.email, endPoint.contactAddress, "Welcome to type-chat-app. You are getting this mail because you have just recently opened an account with us.please disregard if you didnt.Cclick on the link below to verify your account", "Account creation", url)

              successResponse(res, undefined, 200, "Verification mail sent successfully")
       },



       checkVerifyEmailToken: async (req: Request, res: Response, next: NextFunction) => {
              const { verifyEmailToken } = req.params;
              interface customRes extends Request { userId: ObjectId, userData: any }
              const { userId } = req as customRes
              const isToken = await verifyEmail.findOne({
                     user: userId,
                     verificationToken: verifyEmailToken,
                     $lte: { expires: new Date(Date.now()) }
              });

              if (!isToken) {
                     return next(new customError("link expired or does not exist", 404));
              }


              successResponse(res, undefined, 200, "Email verified successfully");
       },

       logout: async (req: Request, res: Response, next: NextFunction) => {
              interface customRes extends Request { userId: ObjectId }

              const { userId } = req as customRes;

              await User.findByIdAndUpdate(
                     userId,
                     { $set: { isLoggedIn: false } },
                     { new: true, runValidators: true }
              );

              res.status(200).json({
                     success: true,
                     message: "logged out successefully",
              });
       }

}
export default auth
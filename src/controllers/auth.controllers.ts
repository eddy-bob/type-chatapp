import { Response, Request, NextFunction } from "express"
import successResponse from "../helpers/success.response"
import nodemailer from "../services/nodemailer"
import verifyEmail from "../entities/verifyEmail"
import { customError } from "../helpers/customError"
import User from "../entities/User"
import endPoint from "../config/endpoints.config"


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
              const isAuth = user.comparePassword();
              if (isAuth == true) {
                     const authUser = await User.findByIdAndUpdate(
                            user._id, { $set: { isLoggedIn: true } }, { runValidators: true, new: true }
                     )
                     const token = authUser.generateJWT()
                     successResponse(res, authUser, 201, "Signin successful", token)
              } else { return next(new customError("Sorry Email and Password did not work", 401)) }

       }
}
export default auth
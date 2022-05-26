import { Request, Response, NextFunction } from "express"
import { customError } from "../helpers/customError"
import { validateToken } from "../api/validateToken"

import User from "../entities/User"
import { ObjectId } from "mongoose"


let userDetails: any;
// declare fetch details 
const getUserDetails = async (id: ObjectId, next: NextFunction) => {
       try {
              userDetails = await User.findById(id)
              console.log(userDetails)
       } catch (err: any) {
              return next(new customError(err.message, 500))
       }
}
// extend the request interface to make provision for non natice parameters
interface Authorize extends Request { userId: ObjectId, userRole: string, userData: any }
// declare middleware
const secure = (req: Authorize, res: Response, next: NextFunction) => {
       // make sure req.headers.authorization doesnt come undefined
       if (typeof req.headers.authorization === "undefined") { req.headers.authorization = "" }

       if (req.headers.authorization === "") {
              return next(new customError("You are not authorized to access this route", 401))
       } else {
              if (!req.headers.authorization.startsWith("Bearer")) { return next(new customError("You are not authorized to access this route", 401)) }
              const token: string = req.headers.authorization.split(" ")[1]
              const response = validateToken(token)
              if (response.id) {
                     // fetch user details from database
                     getUserDetails(response.id, next),
                            // store user id in the userId variable
                            req.userId = response.id;
                     // store user role in the userRole variable
                     req.userRole = userDetails.role
                     req.userData = userDetails

                     next()
              }
              else {
                     if (response.name === 'TokenExpiredError') { return next(new customError("Token is expired", 401)) }
                     else { return next(new customError("You are not authorized to access this route", 401)) }
              }
       }
}
export default secure
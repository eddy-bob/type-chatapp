import { Request, Response, NextFunction } from "express"
import { customError } from "../helpers/customError"
import { validateToken } from "../api/validateToken"

import { User } from "../entities/User"
import {
       getMongoRepository,
       ObjectID
} from "typeorm"
// instantiate repository
const repository = getMongoRepository(User);

let userDetails: any;
// declare fetch details 
const getUserDetails = async (id: ObjectID, next: NextFunction) => {
       try {
              userDetails = await repository.findOne({ where: { id } });
              console.log(userDetails)
       } catch (err) {
              return next(new customError())
       }
}
// extend the request interface to make provision for non natice parameters
interface Authorize extends Request { userId: ObjectID, userRole: string }
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

                     next()
              }
              else {
                     if (response.name === 'TokenExpiredError') { return next(new customError("Token is expired", 401)) }
                     else { return next(new customError("You are not authorized to access this route", 401)) }
              }
       }
}
export default secure
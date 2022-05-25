import { Response, Request, NextFunction } from "express"
import successResponse from "../helpers/success.response"
import database from "../database/database"

import { customError } from "../helpers/customError"
import User from "../entities/User"
interface UserI {
       email: string,
       firstName: string, lastName: string, password: string,
       mobile?: number,
       zipcode?: number,
       profilePicture?: string,
       role?: string,
       isLoggedIn?: boolean,

}
const auth = {
       register: async (req: Request, res: Response, next: NextFunction): Promise<void> => {


              try {
                     const data: UserI = await User.create(req.body)
                     if (data) { successResponse(res, data, 200, "user created successfully") }
                     else { return next(new customError("Failed to create user")) }
              } catch (err: any) {
                     next(new customError())
              }

       },
       login: async (req: Request, res: Response, next: NextFunction): Promise<void> => { }
}
export default auth
import { Response, Request, NextFunction } from "express"
import successResponse from "../helpers/success.response"
import database from "../database/database"

import { customError } from "../helpers/customError"
import  User  from "../entities/User"
const user = new User()
const auth = {
       register: async (req: Request, res: Response, next: NextFunction): Promise<void> => {

              const data = user.firstName
              if (data) { successResponse(res, data, 200, "user created successfully") }
              else { return next(new customError("Failed to create user")) }


       },
       login: async (req: Request, res: Response, next: NextFunction): Promise<void> => { }
}
export default auth
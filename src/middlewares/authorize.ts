import { Request, Response, NextFunction } from "express"
import { customError } from "../helpers/customError"

interface Authorize extends Request { userRole: string }
const authorize = ([...roles]: string[]): any => {
       return (req: Authorize, res: Response, next: NextFunction) => {
              if (roles.includes(req.userRole)) { next() }
              else { return next(new customError("You are forbidden to access this route", 403)) }

       }
}
export default authorize
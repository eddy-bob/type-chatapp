import { Response, Request, NextFunction } from "express"
import { customErrorInterface } from "../helpers/customError"
const error = (err: customErrorInterface, req: Request, res: Response, next: NextFunction) => {

       if (err.message.startsWith("E11000 duplicate key error collection")) {
              return res
                     .status(err.statusCode || 500)
                     .json({
                            success: false,
                            data: null,
                            Error:
                                   `sorry no two users can have matching details eg email,username,phone number,  etc.Check ${err.message.split("key")[2]}`,
                     });
       } else {
              res
                     .status(err.statusCode || 500)
                     .json({ success: false, data: null, Error: err.message });
       }
       next()
}
export default error
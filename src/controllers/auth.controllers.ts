import { Response, Request, NextFunction } from "express"
import successResponse from "../helpers/success.response"
import { customError } from "../helpers/customError"
const auth = {
       register: async (req: Request, res: Response, next: NextFunction): Promise<void> => { },
       login: async (req: Request, res: Response, next: NextFunction): Promise<void> => { }
}
export default auth
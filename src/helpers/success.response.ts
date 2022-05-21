import { Response } from "express"
const successResponse = (response: Response, data: Object, statusCode: number, message: string, access_token?: string): void => {
       if (access_token) {
              response.status(statusCode).json({ data, message, access_token })
       } else { response.status(statusCode).json({ data, message }) }

       return
}
export default successResponse
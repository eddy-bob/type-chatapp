import { validateToken } from "../api/validateToken"
const socketAuth = (token: string) => {
       const response = validateToken(token)
       return response
}
export default socketAuth
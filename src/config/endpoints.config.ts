import { config } from "dotenv"
interface Endpoint { port: string, mongoString: string, mongoName: string, userName: string, password: string, bycriptHashRound: number, enviroment: String }
// instantiate enviroment variables
config({ path: ".env" })
const endpoint: Endpoint = {
       port: process.env.PORT as string,
       mongoString: process.env.DB_CONN_STRING as string,
       mongoName: process.env.DB_NAME as string,
       userName: process.env.DB_USERNAME as string,
       password: process.env.DB_PASSWORD as string,
       bycriptHashRound: process.env.HASH_ROUND as unknown as number,
       enviroment: process.env.NODE_ENV as string
}
export default endpoint
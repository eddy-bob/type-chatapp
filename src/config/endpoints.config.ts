import { config } from "dotenv"
interface Endpoint {
       port: string, mongoString: string, mongoName: string, userName: string, password: string, bycriptHashRound: number, enviroment: string, cloudName: string,
       cloudinaryUrl: string,
       cloudApiSecret: string,
       cloudApiKey: string,
       contactAddress: string,
       mailPassword: string,
       mailUsername: string,
       mailerHost: string,
       passPhrase: string
}
// instantiate enviroment variables
config({ path: ".env" })
const endpoint: Endpoint = {
       port: process.env.PORT as string,
       mongoString: process.env.DB_CONN_STRING as string,
       mongoName: process.env.DB_NAME as string,
       userName: process.env.DB_USERNAME as string,
       password: process.env.DB_PASSWORD as string,
       bycriptHashRound: process.env.HASH_ROUND as unknown as number,
       enviroment: process.env.NODE_ENV as string,
       cloudName: process.env.CLOUD_NAME as string,
       cloudinaryUrl: process.env.CLOUDINARY_URL as string,
       cloudApiSecret: process.env.CLOUD_API_SECRET as string,
       cloudApiKey: process.env.CLOUD_API_KEY as string,
       contactAddress: process.env.MY_CONTACT_ADDRESS as string,
       mailPassword: process.env.MAIL_PASSWORD as string,
       mailUsername: process.env.MAIL_USERNAME as string,
       mailerHost: process.env.NODE_MAILER_HOST as string,
       passPhrase: process.env.PASSPHRASE as string
}
export default endpoint
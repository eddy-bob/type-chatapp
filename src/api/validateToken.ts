import * as fs from 'fs';
import * as path from 'path';
import { verify, VerifyOptions } from 'jsonwebtoken';




export const validateToken = (token: string): any => {
       const verifyOptions: VerifyOptions = {
              algorithms: ['RS256'],
       }
       // fetch public key
       const publicKey = fs.readFileSync(path.resolve(__dirname, '../../public.key'), { encoding: "utf8" });
       const response = verify(token, publicKey, verifyOptions)
       return response
}

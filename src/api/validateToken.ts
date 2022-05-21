import * as fs from 'fs';
import * as path from 'path';
import { verify, VerifyOptions } from 'jsonwebtoken';


export const validateToken = (token: string): any => {
       const verifyOptions: VerifyOptions = {
              algorithms: ['RS256'],
       }
       // fetch public key
       const publicKey = fs.readFileSync(path.join(__dirname, '../public.pem'));
       const response = verify(token, publicKey, verifyOptions)
       return response
}

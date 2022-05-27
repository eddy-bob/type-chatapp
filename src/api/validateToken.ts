import * as fs from 'fs';
import * as path from 'path';
import { verify, VerifyOptions } from 'jsonwebtoken';
import endpoint from "../config/endpoints.config";



export const validateToken = (token: string): any => {
       const verifyOptions: VerifyOptions = {
              algorithms: ['RS256'],
       }
       // fetch public key
       const publicKey = fs.readFileSync(path.resolve(__dirname, '../../public.key'));
       const response = verify(token, { key: publicKey, passphrase: endpoint.passPhrase }, verifyOptions)
       return response
}

import { sign, SignOptions } from "jsonwebtoken"
import * as fs from 'fs';
import * as path from 'path';

export default function generateJWT(payload: { id: string }) {

       const privateKey = fs.readFileSync(path.join(__dirname, '../private.pem'))
       const signInOptions: SignOptions = {
              // RS256 uses a public/private key pair. The API provides the private key
              // to generate the JWT. The client gets a public key to validate the
              // signature
              algorithm: 'RS256',
              expiresIn: '2h'
       };

       return sign(payload, privateKey, signInOptions);
}
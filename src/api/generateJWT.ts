import { sign, SignOptions } from "jsonwebtoken"
import * as fs from 'fs';
import * as path from 'path';
import endpoint from "../config/endpoints.config";

export default function generateJWT(payload: { id: string }) {
       const privateKey = fs.readFileSync(path.resolve(__dirname, '../../private.key'), { encoding: "utf8" })
       const signInOptions: SignOptions = {
              // RS256 uses a public/private key pair. The API provides the private key
              // to generate the JWT. The client gets a public key to validate the
              // signature

              algorithm: 'RS256',
              expiresIn: '5d'
       };
       const signed = sign(payload, { key: privateKey, passphrase: endpoint.passPhrase }, signInOptions);
       return signed
}
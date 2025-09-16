import { generateKeyPairSync } from "crypto";
import {writeFileSync, mkdirSync, existsSync} from "fs"
import { chmod } from "fs/promises";
import {join} from "path"

export async function generate(username : string){
 const {publicKey, privateKey} = generateKeyPairSync("rsa", {
    modulusLength:2048, 
    publicKeyEncoding: {type: "spki", format: "pem"},
    privateKeyEncoding: {type: "pkcs8", format: "pem"},
 })

 const dir = join(process.env.HOME || process.env.USERPROFIILE || ".", ".envelope");
    if(!existsSync(dir)) mkdirSync(dir)
    
    const pubPath = join(dir, "id_rsa.pub");
    const privPath = join(dir, "id_rsa");
    const namePath = join(dir, "username.txt");

    writeFileSync(pubPath, publicKey)
    writeFileSync(privPath, privateKey)
    writeFileSync(namePath, username)

    await chmod(privPath, 0o600)
    await chmod(pubPath, 0o644)
    

    console.log(`Keys and username saved to ${dir}`)
}
import { privateDecrypt, publicEncrypt } from "crypto";
import { writeFile } from "fs/promises";

export async function asymmetricEncrypt(text:string,pub_key: string, user:string){
    const cwd = process.cwd()
    const path = `${cwd}/.envelope/envelopes.txt`
    const fullKey = pub_key.includes('-----BEGIN PUBLIC KEY-----') 
    ? pub_key 
    : `-----BEGIN PUBLIC KEY-----\n${pub_key}\n-----END PUBLIC KEY-----`;
    const encrypted = publicEncrypt(fullKey, Buffer.from(text));
    const toWrite = `${user}=${encrypted.toString("base64")}__\n`
   try{
    await writeFile(path, toWrite, "utf-8");
}catch(error : any){
    throw new Error(`Failed to write file: ${error.message}`)
}
    return {path} 
}

export function asymmetricDecrypt(text:string, priv_key: string){
    const fullKey = priv_key.includes('-----BEGIN PRIVATE KEY-----') 
    ? priv_key 
    : `-----BEGIN PRIVATE KEY-----\n${priv_key}\n-----END PRIVATE KEY-----`;
    const encryptedBuffer = Buffer.from(text, "base64")
    return privateDecrypt(fullKey, encryptedBuffer).toString("utf-8")
}
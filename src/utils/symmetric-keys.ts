import { randomBytes, createCipheriv, createDecipheriv } from "crypto";
import { writeFile } from "fs/promises";


export async function symmetricEncrypt(text:string){
    const iv_val = randomBytes(16)
    const key = randomBytes(32);
    const cwd = process.cwd()
    const path = `${cwd}/.envelope/envelope_enc.txt`

    const cipher = createCipheriv("aes-256-gcm", key, iv_val);
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag()
    try{
        await writeFile(path, encrypted, "utf-8");
}catch(error : any){
    throw new Error(`Failed to write file: ${error.message}`)
}
    const iv = iv_val.toString("hex") + "__" + authTag.toString("hex")
    return {encrypted, key, iv, path}
}

export function symmetricDecrypt(text:string, key:any, iv: string){
    const [iv_hex, authTag_hex] = iv.split("__")
    if(!iv_hex || !authTag_hex) return
    const iv_val = Buffer.from(iv_hex, 'hex')
    const authTag = Buffer.from(authTag_hex, 'hex')
    const decipher = createDecipheriv("aes-256-gcm", key,iv_val)
    decipher.setAuthTag(authTag)
    let decrypted = decipher.update(text, "hex", "utf-8")
    decrypted += decipher.final("utf-8")
    return decrypted
}
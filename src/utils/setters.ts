import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import { join } from "path"

export async function setEnv(text:string){
    const cwd = process.cwd()
    const path = `${cwd}/.env`
   try{
    await writeFile(path, text, "utf-8")
       }    catch(error :any){
        throw new Error(`Failed to write .env file: ${error.message as string}`)
    }
}

export async function setKeys(text:string){
    const cwd = process.cwd()
    const envelopeDir = join(cwd, '.envelope')
    
    // Create .envelope directory if it doesn't exist
    if (!existsSync(envelopeDir)) {
        await mkdir(envelopeDir, { recursive: true })
    }
    
    const path = join(envelopeDir, 'envelope_keys.txt')
    try {
        await writeFile(path, text, "utf-8")
    } catch(error : any){
        throw new Error(`Failed to write file: ${error.message}`)
    }
}
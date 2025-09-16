import { writeFile } from "fs/promises"

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
    const path = `${cwd}/.envelope/envelope_keys.txt`
    try {
        await writeFile(path, text, "utf-8")}catch(error : any){
        throw new Error(`Failed to write file: error.message`)
    }
}
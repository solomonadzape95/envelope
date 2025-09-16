import { Command } from "commander"
import getUserDetails, { getEnvDetails, getTeamDetails } from "../utils/getters"
import { readData } from "../db/read_data"
import { setKeys } from "../utils/setters"
import { symmetricEncrypt } from "../utils/symmetric-keys"
import { asymmetricEncrypt } from "../utils/asymmetric-keys"
import { ask } from "../utils/inquirer"
import { withSpinner } from "../utils/spinner"
import { safeAction, UserError } from "../utils/errors"

export function update(){
    const command  = new Command()

    command
    .name("update")
    .description("Pull keys for the specified project and locks the .env")
    .argument("<project>", "The project to pull keys for")
    .action(safeAction(async (project) => {
        const {exists : userKeysExists, pub_key, username} = getUserDetails();
        const {exists : teamKeysExists, keys} = getTeamDetails()
        const {exists: envFileExists, fileContent} = getEnvDetails()
        if(!userKeysExists || !username){
            console.log("You have no keys generated on your device", "Run 'envelope gen' to generate keys")
            return
        }
        if(project === ""){
            throw new UserError("Please enter a project name to pull keys for")
        }
        if(!envFileExists){
            console.log("You do not have a .env file to encrypt in this directory", "Run 'touch .env' to create one")
            return
        }
        
        await withSpinner(`Updating keys shared with ${username} for ${project}`, async () => {
            const rows = await readData(project,username)
        
        if(typeof(rows) === "string"){
           console.log("Seems there are no keys shared with you")
           return
        }
        for(const row of rows){
                const {shared_by,pub_key} = row
                const text = `${shared_by}=${pub_key}__\n`
                await setKeys(text)
            }
        const cwd = process.cwd();
        const path = `${cwd}/.envelope/envelope_keys.txt`
        console.log(`Pulled keys for project: ${project}`, `The keys are found at ${path}`);
        
        if(!teamKeysExists){
            const confirm = await ask("You are encrypting the .env with just your key. Do you want to continue? y/n Default: 'y'", "confirm")
            if(confirm.toLowerCase() !== "y" && confirm.toLowerCase() !== "yes" && confirm.toLowerCase() !== "" ) 
                return;
        }
        const {key: lockKey, iv, path: encryptedPath} = await symmetricEncrypt(fileContent)
        if(pub_key && username){
            if(teamKeysExists){
                let filePath;
            for (const key of keys){
                const {path} = await asymmetricEncrypt(`${lockKey}__${iv}`, key["pub_key"], key["username"]);
                filePath = path
            }
            console.log(`Your .env variables have been encrypted and is found at ${encryptedPath}`, `The key to unlock your .env has been encrypted and is found at ${filePath}`, `To decrypt and unlock the .env, run 'envelope open'.`)
            return
            }
           const {path : envelopePath} = await asymmetricEncrypt(`${lockKey}__${iv}`, pub_key, username)
           console.log(`Your .env variables have been encrypted and is found at ${encryptedPath}`, `The key to unlock your .env has been encrypted and is found at ${envelopePath}`, `To decrypt and unlock the .env, run 'envelope open'.`)
           return
        }
    })}))
    
    return command;
}
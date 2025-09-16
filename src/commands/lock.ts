import { Command } from "commander";
import getUserDetails, { getEnvDetails, getTeamDetails } from "../utils/getters";
import { ask } from "../utils/inquirer";
import { symmetricEncrypt } from "../utils/symmetric-keys";
import { asymmetricEncrypt } from "../utils/asymmetric-keys";
import { withSpinner } from "../utils/spinner";
import { safeAction } from "../utils/errors";

export default function lockEnv(){
    const command = new Command()

    command
    .name("lock")
    .description("Locks .env variables into a .envelope/envelope_enc.txt file and creates lockboxes in .envelope/envelopes.txt with the team's public key")
    .action(safeAction(async ()=>{
        const {exists : userKeysExists, pub_key, username} = getUserDetails();
        const {exists : teamKeysExists, keys} = getTeamDetails()
        const {exists: envFileExists, fileContent} = getEnvDetails()

        if(!userKeysExists){
            console.log("You have no keys generated on your device", "Run 'envelope gen' to generate keys")
            return
        }
        if(!envFileExists){
            console.log("You do not have a .env file to encrypt in this directory", "Run 'touch .env' to create one")
            return
        }
        if(!teamKeysExists){
            const confirm = await ask("You are encrypting the .env with just your key. Do you want to continue? y/n Default: 'y'", "confirm")
            if(confirm.toLowerCase() !== "y" && confirm.toLowerCase() !== "yes" && confirm.toLowerCase() !== "" ) 
                return;
        }
       await withSpinner(`Locking .env for ${username}`, async() => {
        const {key: lockKey, iv, path: encryptedPath} = await symmetricEncrypt(fileContent)
        if(pub_key && username){
            if(teamKeysExists){
                let filePath;
            for (const key of keys){
                const lockData = JSON.stringify({
                    key: lockKey.toString('hex'),
                    iv: iv
                });
                const {path} = await asymmetricEncrypt(lockData, key["pub_key"], key["username"]);
                filePath = path
            }
            console.log(`Your .env variables have been encrypted and is found at ${encryptedPath}`, `The key to unlock your .env has been encrypted and is found at ${filePath}`, `To decrypt and unlock the .env, run 'envelope open'.`)
            return
            }
           const {path : envelopePath} = await asymmetricEncrypt(`${lockKey}__${iv}`, pub_key, username)
           console.log(`Your .env variables have been encrypted and is found at ${encryptedPath}`, `The key to unlock your .env has been encrypted and is found at ${envelopePath}`, `To decrypt and unlock the .env, run 'envelope open'.`)
           return
        }
       }) 
        
    }))
    return command;
}
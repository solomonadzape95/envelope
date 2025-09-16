import { Command } from "commander";
import getUserDetails, { getEncryptedEnv, getLockboxes } from "../utils/getters";
import { asymmetricDecrypt } from "../utils/asymmetric-keys";
import { symmetricDecrypt } from "../utils/symmetric-keys";
import { setEnv } from "../utils/setters";
import { withSpinner } from "../utils/spinner";
import { safeAction, UserError } from "../utils/errors";

export function openEnv(){
    const command  = new Command();

    command
    .name("open")
    .description("Opens the .envelope/envelopes.txt file , uses the lock key to unlock the .envelope/envelope_enc.txt file and create a .env file")
    .action(safeAction(async () => {
        const {exists: userKeysExists, priv_key, username} = getUserDetails();
        const {exists: lockboxesExists, lockbox} = getLockboxes();
        const {exists: encryptedExists, fileContent: encrypted} = getEncryptedEnv()

        if(!userKeysExists){
            console.log("You have no keys generated on your device", "Run 'envelope gen' to generate keys")
            return
        }
        if(!lockboxesExists){
            console.log("You do not have a .envelope/envelopes.txt file to decrypt in this directory", "Run 'envelope lock' to create one")
            return
        }
        if(!encryptedExists){
            console.log("You do not have a .envelope/envelope_enc.txt file to unlock in this directory", "Run 'envelope lock' to create one")
            return
        }
        await withSpinner(`Opening .env for ${username}`,async () => {
          if(priv_key && username){
            if (typeof lockbox.envelope === "string" && typeof encrypted === "string") {
                const lockData = asymmetricDecrypt(lockbox.envelope, priv_key);
                const {key, iv} = JSON.parse(lockData);
                const keyBuffer = Buffer.from(key, 'hex');
                if (typeof key === "string" && typeof iv === "string") {
                    const env = symmetricDecrypt(encrypted, keyBuffer, iv);
                    if(typeof(env) === "string") await setEnv(env)
                    console.log(".env decrypted and updated")
                    return
                } else {
                    throw new UserError("Failed to parse lock key.");
                }
            } else {
                throw new UserError("Lockbox envelope or encrypted env file is missing or invalid.");
            }
        }  
        })
        
        

    }))
    return command
}
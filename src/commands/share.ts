import { Command } from "commander";
import getUserDetails from "../utils/getters";
import { setKeys } from "../utils/setters";
import { safeAction, UserError } from "../utils/errors";

export function shareKeys(){
    const command = new Command()

    command
    .name("share")
    .description("Create envelope_keys file with your username and public key")
    .action(safeAction(async () => {
        const {username, exists:userKeysExists, pub_key} = getUserDetails()
        if(!userKeysExists || !username || !pub_key){
            console.log("You have no keys generated on your device", "Run 'envelope gen' to generate keys")
            return
        }
        
        // Create envelope_keys file with username and pub_key
        const keyData = `${username}=${pub_key}\n`;
        await setKeys(keyData);
        
        const cwd = process.cwd();
        const path = `${cwd}/.envelope/envelope_keys.txt`;
        console.log(`Created envelope_keys file at ${path}`);
    }))
    return command;
}

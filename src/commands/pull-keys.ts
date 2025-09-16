import { Command } from "commander";
import { readData } from "../db/read_data";
import getUserDetails from "../utils/getters";
import { setKeys } from "../utils/setters";
import { withSpinner } from "../utils/spinner";
import { safeAction, UserError } from "../utils/errors";

export function pullKeys(){
    const command = new Command();

    command
    .name("pull")
    .description("Pull keys shared with you for a particular project")
    .argument("<project>", "The project name to pull keys for")
    .action(safeAction(async (project: string) => {
        const {username, exists:userKeysExists} = getUserDetails()
        if(!userKeysExists || !username){
            console.log("You have no keys generated on your device", "Run 'envelope gen' to generate keys")
            return
        }
        if(project === ""){
            throw new UserError("Please enter a project name to pull keys for")
        }
        await withSpinner(`Pulling keys for '${project}'`, async () => {
            const rows = await readData(project,username)
            if(typeof(rows) === "string"){
               throw new UserError("Invalid data, Could not write .envelope/envelope_keys.txt file")
            }
            for(const row of rows){
                    const {shared_by,pub_key} = row
                    const text = `${shared_by}=${pub_key}__\n`
                    await setKeys(text)
                }
        })
        const cwd = process.cwd();
        const path = `${cwd}/.envelope/envelope_keys.txt`
        console.log(`Pulled keys for project: ${project}`, `The keys are found at ${path}`);
        return
    }))
 return command;
}
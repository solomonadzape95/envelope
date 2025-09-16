import { Command } from "commander";
import getUserDetails from "../utils/getters";
import { insertData } from "../db/insert_data";
import { ShareRecord } from "../types";
import { ask } from "../utils/inquirer";
import { withSpinner } from "../utils/spinner";
import { safeAction, UserError } from "../utils/errors";

export function shareKeys(){
    const command = new Command()

    command
    .name("share")
    .description("Share your keys with the team leader for a particular project")
    .argument("<project>", "The project name to share keys for")
    .argument("<team_leader>", "The person to share the keys to")
    .action(safeAction(async (project : string, team_leader  :string) => {
        const {username, exists:userKeysExists, pub_key} = getUserDetails()
        if(!userKeysExists || !username || !pub_key){
            console.log("You have no keys generated on your device", "Run 'envelope gen' to generate keys")
            return
        }
        if (team_leader && !project) {
            throw new UserError("Please enter the project name and team leader, you can't share the key without a project name")
        }
        if (team_leader && project) {
            // store data and share with leader
            let confirmDetails = false, shared_to = team_leader;

            while (confirmDetails !== true) {
                const responseValue = await ask(
                    `Please confirm the details for sharing your key:\n` +
                    `Share To: ${shared_to} For Project: ${project}\n` +
                    `If any or both of these details are wrong, enter the correct details in the format and press enter ` +
                    `(if only one is wrong leave an underscore in place of the correct one):\n` +
                    `<team_lead_name>, <project_name>\n` +
                    `If they are correct just enter 'y' or 'yes' or just press enter`,
                    'confirmDetails'
                );
                switch (responseValue) {
                    case "y":
                    case "yes":
                    case "":
                        confirmDetails = true;
                        break;
                    default:
                        const arr = responseValue.split(',').map((txt: string) => txt.trim());
                        if (arr.length < 2) throw new UserError("Invalid input. Please provide both team lead name and project name separated by a comma.");
                        shared_to = arr[0] === "_" ? shared_to : arr[0];
                        project = arr[1] === "_" ? project : arr[1];

                        break;
                }
            }
                if(pub_key){
                    const data: ShareRecord[] = [{ pub_key, shared_by: username, shared_to, project }]
                    await withSpinner(`Sharing keys to  ${shared_to} for ${project}`, async () => {
                        await insertData(data)
                    
                    }) 
                }
            return
        }
    }))
    return command;}

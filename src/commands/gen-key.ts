import { Command } from "commander"
import { ask } from "../utils/inquirer";
import { generate } from "../utils/generate-keys";
import { insertData } from "../db/insert_data";
import { ShareRecord } from "../types";
import getUserDetails from "../utils/getters";
import { withSpinner } from "../utils/spinner";
import { safeAction, UserError } from "../utils/errors";


export default function generateKeys() {
    const command = new Command()
    command
        .name("gen")
        .description("Generate cryptographic keys")
        .option("-s , --share <NAME>", "Share public keys with <NAME>", "")
        .option("-p , --project <REPO>", "These keys are to be shared for the env in <REPO>", "")
        .action(safeAction(async (options: { share?: string; project?: string }) => {
            const {exists, dir } = getUserDetails()
            if (exists) {
                console.log("You have already ran this command.", `Your details are found at ${dir}`);
                return
            }
            const username = await ask("Enter a unique identifier or username for yourself, preferably your GitHub username. This will ONLY be stored on your device and will be used to identify your key when you share it.", "username")
            if (!username) {
                throw new UserError("Please set your username")
            }
            if (options.share && !options.project) {
                throw new UserError("Please enter the project name, you can't share the key without a project name")
            }
            if (!options.share) {
                await withSpinner(`Generating keys for ${username}`, async () => {
                    await generate(username)
                })
                return
            }
            if (options.share && options.project) {
                await withSpinner(`Generating keys for ${username}`, async () => {
                    await generate(username)
                })
                // store data and share with leader
                let confirmDetails = false, shared_to = options.share, project = options.project;

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
                    const {pub_key} = getUserDetails()
                    if(pub_key){
                        const data: ShareRecord[] = [{ pub_key, shared_by: username, shared_to, project }]
                    await withSpinner(`Sharing keys to  ${shared_to} for ${project}`, async () => {
                        await insertData(data)
                    
                    }) 
                }
                return
            }

        }))
    return command;
}
import { Command } from "commander"
import { ask } from "../utils/inquirer";
import { generate } from "../utils/generate-keys";
import getUserDetails from "../utils/getters";
import { withSpinner } from "../utils/spinner";
import { safeAction, UserError } from "../utils/errors";

export default function generateKeys() {
    const command = new Command()
    command
        .name("gen")
        .description("Generate cryptographic keys")
        .argument("<username>", "Your unique identifier or username")
        .action(safeAction(async (username: string) => {
            const {exists, dir } = getUserDetails()
            if (exists) {
                console.log("You have already ran this command.", `Your details are found at ${dir}`);
                return
            }
            if (!username) {
                throw new UserError("Please provide a username")
            }
            
            await withSpinner(`Generating keys for ${username}`, async () => {
                await generate(username)
            })
            
            console.log(`Keys generated successfully for ${username}`);
        }))
    return command;
}
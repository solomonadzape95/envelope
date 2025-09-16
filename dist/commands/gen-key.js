"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateKeys;
const commander_1 = require("commander");
const inquirer_1 = require("../utils/inquirer");
const generate_keys_1 = require("../utils/generate-keys");
const insert_data_1 = require("../db/insert_data");
const getters_1 = __importDefault(require("../utils/getters"));
const spinner_1 = require("../utils/spinner");
const errors_1 = require("../utils/errors");
function generateKeys() {
    const command = new commander_1.Command();
    command
        .name("gen")
        .description("Generate cryptographic keys")
        .option("-s , --share <NAME>", "Share public keys with <NAME>", "")
        .option("-p , --project <REPO>", "These keys are to be shared for the env in <REPO>", "")
        .action((0, errors_1.safeAction)(async (options) => {
        const { exists, dir } = (0, getters_1.default)();
        if (exists) {
            console.log("You have already ran this command.", `Your details are found at ${dir}`);
            return;
        }
        const username = await (0, inquirer_1.ask)("Enter a unique identifier or username for yourself, preferably your GitHub username. This will ONLY be stored on your device and will be used to identify your key when you share it.", "username");
        if (!username) {
            throw new errors_1.UserError("Please set your username");
        }
        if (options.share && !options.project) {
            throw new errors_1.UserError("Please enter the project name, you can't share the key without a project name");
        }
        if (!options.share) {
            await (0, spinner_1.withSpinner)(`Generating keys for ${username}`, async () => {
                await (0, generate_keys_1.generate)(username);
            });
            return;
        }
        if (options.share && options.project) {
            await (0, spinner_1.withSpinner)(`Generating keys for ${username}`, async () => {
                await (0, generate_keys_1.generate)(username);
            });
            // store data and share with leader
            let confirmDetails = false, shared_to = options.share, project = options.project;
            while (confirmDetails !== true) {
                const responseValue = await (0, inquirer_1.ask)(`Please confirm the details for sharing your key:\n` +
                    `Share To: ${shared_to} For Project: ${project}\n` +
                    `If any or both of these details are wrong, enter the correct details in the format and press enter ` +
                    `(if only one is wrong leave an underscore in place of the correct one):\n` +
                    `<team_lead_name>, <project_name>\n` +
                    `If they are correct just enter 'y' or 'yes' or just press enter`, 'confirmDetails');
                switch (responseValue) {
                    case "y":
                    case "yes":
                    case "":
                        confirmDetails = true;
                        break;
                    default:
                        const arr = responseValue.split(',').map((txt) => txt.trim());
                        if (arr.length < 2)
                            throw new errors_1.UserError("Invalid input. Please provide both team lead name and project name separated by a comma.");
                        shared_to = arr[0] === "_" ? shared_to : arr[0];
                        project = arr[1] === "_" ? project : arr[1];
                        break;
                }
            }
            const { pub_key } = (0, getters_1.default)();
            if (pub_key) {
                const data = [{ pub_key, shared_by: username, shared_to, project }];
                await (0, spinner_1.withSpinner)(`Sharing keys to  ${shared_to} for ${project}`, async () => {
                    await (0, insert_data_1.insertData)(data);
                });
            }
            return;
        }
    }));
    return command;
}
//# sourceMappingURL=gen-key.js.map
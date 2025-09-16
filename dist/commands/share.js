"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareKeys = shareKeys;
const commander_1 = require("commander");
const getters_1 = __importDefault(require("../utils/getters"));
const insert_data_1 = require("../db/insert_data");
const inquirer_1 = require("../utils/inquirer");
const spinner_1 = require("../utils/spinner");
const errors_1 = require("../utils/errors");
function shareKeys() {
    const command = new commander_1.Command();
    command
        .name("share")
        .description("Share your keys with the team leader for a particular project")
        .argument("<project>", "The project name to share keys for")
        .argument("<team_leader>", "The person to share the keys to")
        .action((0, errors_1.safeAction)(async (project, team_leader) => {
        const { username, exists: userKeysExists, pub_key } = (0, getters_1.default)();
        if (!userKeysExists || !username || !pub_key) {
            console.log("You have no keys generated on your device", "Run 'envelope gen' to generate keys");
            return;
        }
        if (team_leader && !project) {
            throw new errors_1.UserError("Please enter the project name and team leader, you can't share the key without a project name");
        }
        if (team_leader && project) {
            // store data and share with leader
            let confirmDetails = false, shared_to = team_leader;
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
//# sourceMappingURL=share.js.map
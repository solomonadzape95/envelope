"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pullKeys = pullKeys;
const commander_1 = require("commander");
const getters_1 = __importDefault(require("../utils/getters"));
const setters_1 = require("../utils/setters");
const spinner_1 = require("../utils/spinner");
const errors_1 = require("../utils/errors");
const api_1 = require("../utils/api");
function pullKeys() {
    const command = new commander_1.Command();
    command
        .name("pull")
        .description("Pull keys shared with you for a particular project")
        .argument("<project>", "The project name to pull keys for")
        .action((0, errors_1.safeAction)(async (project) => {
        const { username, exists: userKeysExists } = (0, getters_1.default)();
        if (!userKeysExists || !username) {
            console.log("You have no keys generated on your device", "Run 'envelope gen' to generate keys");
            return;
        }
        if (project === "") {
            throw new errors_1.UserError("Please enter a project name to pull keys for");
        }
        await (0, spinner_1.withSpinner)(`Pulling keys for '${project}'`, async () => {
            const api = new api_1.ApiClient();
            const records = await api.listShareRecords({ project: project });
            for (const row of records) {
                const { shared_by, pub_key } = row;
                const text = `${shared_by}=${pub_key}__\n`;
                await (0, setters_1.setKeys)(text);
            }
        });
        const cwd = process.cwd();
        const path = `${cwd}/envelope_keys.txt`;
        console.log(`Pulled keys for project: ${project}`, `The keys are found at ${path}`);
        return;
    }));
    return command;
}
//# sourceMappingURL=pull-keys.js.map
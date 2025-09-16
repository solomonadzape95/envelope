"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = update;
const commander_1 = require("commander");
const getters_1 = __importStar(require("../utils/getters"));
const setters_1 = require("../utils/setters");
const symmetric_keys_1 = require("../utils/symmetric-keys");
const asymmetric_keys_1 = require("../utils/asymmetric-keys");
const inquirer_1 = require("../utils/inquirer");
const spinner_1 = require("../utils/spinner");
const errors_1 = require("../utils/errors");
const api_1 = require("../utils/api");
function update() {
    const command = new commander_1.Command();
    command
        .name("update")
        .description("Pull keys for the specified project and locks the .env")
        .argument("<project>", "The project to pull keys for")
        .action((0, errors_1.safeAction)(async (project) => {
        const { exists: userKeysExists, pub_key, username } = (0, getters_1.default)();
        const { exists: teamKeysExists, keys } = (0, getters_1.getTeamDetails)();
        const { exists: envFileExists, fileContent } = (0, getters_1.getEnvDetails)();
        if (!userKeysExists || !username) {
            console.log("You have no keys generated on your device", "Run 'envelope gen' to generate keys");
            return;
        }
        if (project === "") {
            throw new errors_1.UserError("Please enter a project name to pull keys for");
        }
        if (!envFileExists) {
            console.log("You do not have a .env file to encrypt in this directory", "Run 'touch .env' to create one");
            return;
        }
        await (0, spinner_1.withSpinner)(`Updating keys shared with ${username} for ${project}`, async () => {
            const api = new api_1.ApiClient();
            const rows = await api.listShareRecords({ project: project });
            if (!rows || rows.length === 0) {
                console.log("Seems there are no keys shared with you");
                return;
            }
            for (const row of rows) {
                const { shared_by, pub_key } = row;
                const text = `${shared_by}=${pub_key}__\n`;
                await (0, setters_1.setKeys)(text);
            }
            const cwd = process.cwd();
            const path = `${cwd}/envelope_keys.txt`;
            console.log(`Pulled keys for project: ${project}`, `The keys are found at ${path}`);
            if (!teamKeysExists) {
                const confirm = await (0, inquirer_1.ask)("You are encrypting the .env with just your key. Do you want to continue? y/n Default: 'y'", "confirm");
                if (confirm.toLowerCase() !== "y" && confirm.toLowerCase() !== "yes" && confirm.toLowerCase() !== "")
                    return;
            }
            const { key: lockKey, iv, path: encryptedPath } = await (0, symmetric_keys_1.symmetricEncrypt)(fileContent);
            if (pub_key && username) {
                if (teamKeysExists) {
                    let filePath;
                    for (const key of keys) {
                        const { path } = await (0, asymmetric_keys_1.asymmetricEncrypt)(`${lockKey}__${iv}`, key["pub_key"], key["username"]);
                        filePath = path;
                    }
                    console.log(`Your .env variables have been encrypted and is found at ${encryptedPath}`, `The key to unlock your .env has been encrypted and is found at ${filePath}`, `To decrypt and unlock the .env, run 'envelope open'.`);
                    return;
                }
                const { path: envelopePath } = await (0, asymmetric_keys_1.asymmetricEncrypt)(`${lockKey}__${iv}`, pub_key, username);
                console.log(`Your .env variables have been encrypted and is found at ${encryptedPath}`, `The key to unlock your .env has been encrypted and is found at ${envelopePath}`, `To decrypt and unlock the .env, run 'envelope open'.`);
                return;
            }
        });
    }));
    return command;
}
//# sourceMappingURL=update.js.map
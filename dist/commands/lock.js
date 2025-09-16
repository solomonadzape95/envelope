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
exports.default = lockEnv;
const commander_1 = require("commander");
const getters_1 = __importStar(require("../utils/getters"));
const inquirer_1 = require("../utils/inquirer");
const symmetric_keys_1 = require("../utils/symmetric-keys");
const asymmetric_keys_1 = require("../utils/asymmetric-keys");
const spinner_1 = require("../utils/spinner");
const errors_1 = require("../utils/errors");
function lockEnv() {
    const command = new commander_1.Command();
    command
        .name("lock")
        .description("Locks .env variables into a .envelope/envelope_enc.txt file and creates lockboxes in .envelope/envelopes.txt with the team's public key")
        .action((0, errors_1.safeAction)(async () => {
        const { exists: userKeysExists, pub_key, username } = (0, getters_1.default)();
        const { exists: teamKeysExists, keys } = (0, getters_1.getTeamDetails)();
        const { exists: envFileExists, fileContent } = (0, getters_1.getEnvDetails)();
        if (!userKeysExists) {
            console.log("You have no keys generated on your device", "Run 'envelope gen' to generate keys");
            return;
        }
        if (!envFileExists) {
            console.log("You do not have a .env file to encrypt in this directory", "Run 'touch .env' to create one");
            return;
        }
        if (!teamKeysExists) {
            const confirm = await (0, inquirer_1.ask)("You are encrypting the .env with just your key. Do you want to continue? y/n Default: 'y'", "confirm");
            if (confirm.toLowerCase() !== "y" && confirm.toLowerCase() !== "yes" && confirm.toLowerCase() !== "")
                return;
        }
        await (0, spinner_1.withSpinner)(`Locking .env for ${username}`, async () => {
            const { key: lockKey, iv, path: encryptedPath } = await (0, symmetric_keys_1.symmetricEncrypt)(fileContent);
            if (pub_key && username) {
                if (teamKeysExists) {
                    let filePath;
                    for (const key of keys) {
                        const lockData = JSON.stringify({
                            key: lockKey.toString('hex'),
                            iv: iv
                        });
                        const { path } = await (0, asymmetric_keys_1.asymmetricEncrypt)(lockData, key["pub_key"], key["username"]);
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
//# sourceMappingURL=lock.js.map
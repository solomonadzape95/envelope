"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareKeys = shareKeys;
const commander_1 = require("commander");
const getters_1 = __importDefault(require("../utils/getters"));
const setters_1 = require("../utils/setters");
const errors_1 = require("../utils/errors");
function shareKeys() {
    const command = new commander_1.Command();
    command
        .name("share")
        .description("Create envelope_keys file with your username and public key")
        .action((0, errors_1.safeAction)(async () => {
        const { username, exists: userKeysExists, pub_key } = (0, getters_1.default)();
        if (!userKeysExists || !username || !pub_key) {
            console.log("You have no keys generated on your device", "Run 'envelope gen' to generate keys");
            return;
        }
        // Create envelope_keys file with username and pub_key
        const keyData = `${username}=${pub_key}\n`;
        await (0, setters_1.setKeys)(keyData);
        const cwd = process.cwd();
        const path = `${cwd}/.envelope/envelope_keys.txt`;
        console.log(`Created envelope_keys file at ${path}`);
    }));
    return command;
}
//# sourceMappingURL=share.js.map
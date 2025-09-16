"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateKeys;
const commander_1 = require("commander");
const generate_keys_1 = require("../utils/generate-keys");
const getters_1 = __importDefault(require("../utils/getters"));
const spinner_1 = require("../utils/spinner");
const errors_1 = require("../utils/errors");
function generateKeys() {
    const command = new commander_1.Command();
    command
        .name("gen")
        .description("Generate cryptographic keys")
        .argument("<username>", "Your unique identifier or username")
        .action((0, errors_1.safeAction)(async (username) => {
        const { exists, dir } = (0, getters_1.default)();
        if (exists) {
            console.log("You have already ran this command.", `Your details are found at ${dir}`);
            return;
        }
        if (!username) {
            throw new errors_1.UserError("Please provide a username");
        }
        await (0, spinner_1.withSpinner)(`Generating keys for ${username}`, async () => {
            await (0, generate_keys_1.generate)(username);
        });
        console.log(`Keys generated successfully for ${username}`);
    }));
    return command;
}
//# sourceMappingURL=gen-key.js.map
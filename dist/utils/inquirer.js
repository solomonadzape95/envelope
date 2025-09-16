"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ask = ask;
const inquirer_1 = __importDefault(require("inquirer"));
async function ask(message, name) {
    const answers = await inquirer_1.default.prompt([
        {
            type: "input",
            name,
            message
        }
    ]);
    return answers[name];
}
//# sourceMappingURL=inquirer.js.map
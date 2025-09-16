"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEnv = setEnv;
exports.setKeys = setKeys;
const promises_1 = require("fs/promises");
async function setEnv(text) {
    const cwd = process.cwd();
    const path = `${cwd}/.env`;
    try {
        await (0, promises_1.writeFile)(path, text, "utf-8");
    }
    catch (error) {
        throw new Error(`Failed to write .env file: ${error.message}`);
    }
}
async function setKeys(text) {
    const cwd = process.cwd();
    const path = `${cwd}/.envelope/envelope_keys.txt`;
    try {
        await (0, promises_1.writeFile)(path, text, "utf-8");
    }
    catch (error) {
        throw new Error(`Failed to write file: error.message`);
    }
}
//# sourceMappingURL=setters.js.map
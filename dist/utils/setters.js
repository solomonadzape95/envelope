"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEnv = setEnv;
exports.setKeys = setKeys;
const promises_1 = require("fs/promises");
const fs_1 = require("fs");
const path_1 = require("path");
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
    const envelopeDir = (0, path_1.join)(cwd, '.envelope');
    // Create .envelope directory if it doesn't exist
    if (!(0, fs_1.existsSync)(envelopeDir)) {
        await (0, promises_1.mkdir)(envelopeDir, { recursive: true });
    }
    const path = (0, path_1.join)(envelopeDir, 'envelope_keys.txt');
    try {
        await (0, promises_1.writeFile)(path, text, "utf-8");
    }
    catch (error) {
        throw new Error(`Failed to write file: ${error.message}`);
    }
}
//# sourceMappingURL=setters.js.map
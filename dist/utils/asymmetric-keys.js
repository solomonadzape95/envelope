"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asymmetricEncrypt = asymmetricEncrypt;
exports.asymmetricDecrypt = asymmetricDecrypt;
const crypto_1 = require("crypto");
const promises_1 = require("fs/promises");
const fs_1 = require("fs");
const path_1 = require("path");
async function asymmetricEncrypt(text, pub_key, user) {
    const cwd = process.cwd();
    const envelopeDir = (0, path_1.join)(cwd, '.envelope');
    // Create .envelope directory if it doesn't exist
    if (!(0, fs_1.existsSync)(envelopeDir)) {
        await (0, promises_1.mkdir)(envelopeDir, { recursive: true });
    }
    const path = (0, path_1.join)(envelopeDir, 'envelopes.txt');
    const fullKey = pub_key.includes('-----BEGIN PUBLIC KEY-----')
        ? pub_key
        : `-----BEGIN PUBLIC KEY-----\n${pub_key}\n-----END PUBLIC KEY-----`;
    const encrypted = (0, crypto_1.publicEncrypt)(fullKey, Buffer.from(text));
    const toWrite = `${user}=${encrypted.toString("base64")}__\n`;
    try {
        await (0, promises_1.writeFile)(path, toWrite, "utf-8");
    }
    catch (error) {
        throw new Error(`Failed to write file: ${error.message}`);
    }
    return { path };
}
function asymmetricDecrypt(text, priv_key) {
    const fullKey = priv_key.includes('-----BEGIN PRIVATE KEY-----')
        ? priv_key
        : `-----BEGIN PRIVATE KEY-----\n${priv_key}\n-----END PRIVATE KEY-----`;
    const encryptedBuffer = Buffer.from(text, "base64");
    return (0, crypto_1.privateDecrypt)(fullKey, encryptedBuffer).toString("utf-8");
}
//# sourceMappingURL=asymmetric-keys.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.symmetricEncrypt = symmetricEncrypt;
exports.symmetricDecrypt = symmetricDecrypt;
const crypto_1 = require("crypto");
const promises_1 = require("fs/promises");
const fs_1 = require("fs");
const path_1 = require("path");
async function symmetricEncrypt(text) {
    const iv_val = (0, crypto_1.randomBytes)(16);
    const key = (0, crypto_1.randomBytes)(32);
    const cwd = process.cwd();
    const envelopeDir = (0, path_1.join)(cwd, '.envelope');
    // Create .envelope directory if it doesn't exist
    if (!(0, fs_1.existsSync)(envelopeDir)) {
        await (0, promises_1.mkdir)(envelopeDir, { recursive: true });
    }
    const path = (0, path_1.join)(envelopeDir, 'envelope_enc.txt');
    const cipher = (0, crypto_1.createCipheriv)("aes-256-gcm", key, iv_val);
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag();
    try {
        await (0, promises_1.writeFile)(path, encrypted, "utf-8");
    }
    catch (error) {
        throw new Error(`Failed to write file: ${error.message}`);
    }
    const iv = iv_val.toString("hex") + "__" + authTag.toString("hex");
    return { encrypted, key, iv, path };
}
function symmetricDecrypt(text, key, iv) {
    const [iv_hex, authTag_hex] = iv.split("__");
    if (!iv_hex || !authTag_hex)
        return;
    const iv_val = Buffer.from(iv_hex, 'hex');
    const authTag = Buffer.from(authTag_hex, 'hex');
    const decipher = (0, crypto_1.createDecipheriv)("aes-256-gcm", key, iv_val);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(text, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
}
//# sourceMappingURL=symmetric-keys.js.map
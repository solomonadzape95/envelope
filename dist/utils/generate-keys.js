"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
async function generate(username) {
    const { publicKey, privateKey } = (0, crypto_1.generateKeyPairSync)("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    const dir = (0, path_1.join)(process.env.HOME || process.env.USERPROFIILE || ".", ".envelope");
    if (!(0, fs_1.existsSync)(dir))
        (0, fs_1.mkdirSync)(dir);
    const pubPath = (0, path_1.join)(dir, "id_rsa.pub");
    const privPath = (0, path_1.join)(dir, "id_rsa");
    const namePath = (0, path_1.join)(dir, "username.txt");
    (0, fs_1.writeFileSync)(pubPath, publicKey);
    (0, fs_1.writeFileSync)(privPath, privateKey);
    (0, fs_1.writeFileSync)(namePath, username);
    await (0, promises_1.chmod)(privPath, 0o600);
    await (0, promises_1.chmod)(pubPath, 0o644);
    console.log(`Keys and username saved to ${dir}`);
}
//# sourceMappingURL=generate-keys.js.map
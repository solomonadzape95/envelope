"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getUserDetails;
const fs_1 = require("fs");
const path_1 = require("path");
function getUserDetails() {
    const dir = (0, path_1.join)(process.env.HOME || process.env.USERPROFILE || ".", ".envelope");
    let exists = (0, fs_1.existsSync)(dir);
    const pubPath = (0, path_1.join)(dir, "id_rsa.pub");
    const privPath = (0, path_1.join)(dir, "id_rsa");
    const namePath = (0, path_1.join)(dir, "username.txt");
    let pub_key = null;
    let priv_key = null;
    let username = null;
    try {
        pub_key = (0, fs_1.readFileSync)(pubPath, "utf-8")
            .replace("-----BEGIN PUBLIC KEY-----", "")
            .replace("-----END PUBLIC KEY-----", "")
            .trim() || null;
    }
    catch (err) {
        // File not found or cannot be read
        pub_key = null;
    }
    try {
        priv_key = (0, fs_1.readFileSync)(privPath, "utf-8")
            .replace("-----BEGIN PRIVATE KEY-----", "")
            .replace("-----END PRIVATE KEY-----", "")
            .trim() || null;
    }
    catch (err) {
        priv_key = null;
    }
    try {
        username = (0, fs_1.readFileSync)(namePath, "utf-8").trim() || null;
    }
    catch (err) {
        username = null;
    }
    return { priv_key, pub_key, username, exists, dir };
}
//# sourceMappingURL=get-user-details.js.map
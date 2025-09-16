"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeamDetails = getTeamDetails;
exports.default = getUserDetails;
exports.getEnvDetails = getEnvDetails;
exports.getLockboxes = getLockboxes;
exports.getEncryptedEnv = getEncryptedEnv;
const fs_1 = require("fs");
const path_1 = require("path");
function getTeamDetails() {
    const cwd = process.cwd();
    const path = (0, path_1.join)(cwd, '.envelope', 'envelope_keys.txt');
    const exists = (0, fs_1.existsSync)(path);
    if (!exists)
        return { exists };
    const fileContent = (0, fs_1.readFileSync)(path, { encoding: "utf8" });
    // Split by lines that start with a username (no leading whitespace and contains =)
    const lines = fileContent.split("\n");
    const keys = [];
    let currentKey = null;
    for (const line of lines) {
        if (line.trim() === "")
            continue;
        // Check if this line starts a new key (contains = and doesn't start with whitespace)
        if (line.includes("=") && !line.startsWith(" ") && !line.startsWith("\t")) {
            // Save previous key if exists
            if (currentKey && currentKey.username && currentKey.pub_key) {
                keys.push(currentKey);
            }
            // Start new key
            const equalIndex = line.indexOf("=");
            const username = line.substring(0, equalIndex);
            const pub_key = line.substring(equalIndex + 1);
            currentKey = { username, pub_key };
        }
        else if (currentKey) {
            // This is a continuation of the current key
            currentKey.pub_key += "\n" + line;
        }
    }
    // Add the last key if it exists
    if (currentKey && currentKey.username && currentKey.pub_key) {
        keys.push(currentKey);
    }
    return { keys, exists };
}
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
        pub_key = (0, fs_1.readFileSync)(pubPath, "utf-8") || null;
    }
    catch (err) {
        // File not found or cannot be read
        pub_key = null;
    }
    try {
        priv_key = (0, fs_1.readFileSync)(privPath, "utf-8") || null;
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
function getEnvDetails() {
    const cwd = process.cwd();
    const path = `${cwd}/.env`;
    const exists = (0, fs_1.existsSync)(path);
    if (!exists)
        return { exists };
    const fileContent = (0, fs_1.readFileSync)(path, { encoding: "utf8" });
    return { fileContent, exists };
}
function getLockboxes() {
    const cwd = process.cwd();
    const path = (0, path_1.join)(cwd, '.envelope', 'envelopes.txt');
    const exists = (0, fs_1.existsSync)(path);
    if (!exists)
        return { exists };
    const fileContent = (0, fs_1.readFileSync)(path, { encoding: "utf8" });
    if (!fileContent.trim()) {
        return { exists: false, lockbox: { username: "", envelope: "" } };
    }
    const { username: user } = getUserDetails();
    const lockbox = fileContent
        .split("\n")
        .filter(line => line.trim().length > 0)
        .map(line => {
        const cleaned = line.endsWith("__") ? line.slice(0, -2) : line;
        const [username, envelope] = cleaned.split("=");
        if (username === user) {
            if (typeof username === "string" && typeof envelope === "string") {
                return { username, envelope };
            }
        }
        else {
            return { username: "", envelope: "" };
        }
    })[0] || { username: "", envelope: "" };
    return { lockbox, exists };
}
function getEncryptedEnv() {
    const cwd = process.cwd();
    const path = (0, path_1.join)(cwd, '.envelope', 'envelope_enc.txt');
    const exists = (0, fs_1.existsSync)(path);
    if (!exists)
        return { exists };
    const fileContent = (0, fs_1.readFileSync)(path, { encoding: "utf8" });
    return { fileContent, exists };
}
//# sourceMappingURL=getters.js.map
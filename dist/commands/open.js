"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.openEnv = openEnv;
const commander_1 = require("commander");
const getters_1 = __importStar(require("../utils/getters"));
const asymmetric_keys_1 = require("../utils/asymmetric-keys");
const symmetric_keys_1 = require("../utils/symmetric-keys");
const setters_1 = require("../utils/setters");
const spinner_1 = require("../utils/spinner");
const errors_1 = require("../utils/errors");
function openEnv() {
    const command = new commander_1.Command();
    command
        .name("open")
        .description("Opens the .envelope/envelopes.txt file , uses the lock key to unlock the .envelope/envelope_enc.txt file and create a .env file")
        .action((0, errors_1.safeAction)(async () => {
        const { exists: userKeysExists, priv_key, username } = (0, getters_1.default)();
        const { exists: lockboxesExists, lockbox } = (0, getters_1.getLockboxes)();
        const { exists: encryptedExists, fileContent: encrypted } = (0, getters_1.getEncryptedEnv)();
        if (!userKeysExists) {
            console.log("You have no keys generated on your device", "Run 'envelope gen' to generate keys");
            return;
        }
        if (!lockboxesExists) {
            console.log("You do not have a .envelope/envelopes.txt file to decrypt in this directory", "Run 'envelope lock' to create one");
            return;
        }
        if (!encryptedExists) {
            console.log("You do not have a .envelope/envelope_enc.txt file to unlock in this directory", "Run 'envelope lock' to create one");
            return;
        }
        await (0, spinner_1.withSpinner)(`Opening .env for ${username}`, async () => {
            if (priv_key && username) {
                if (typeof lockbox.envelope === "string" && typeof encrypted === "string") {
                    const lockData = (0, asymmetric_keys_1.asymmetricDecrypt)(lockbox.envelope, priv_key);
                    const { key, iv } = JSON.parse(lockData);
                    const keyBuffer = Buffer.from(key, 'hex');
                    if (typeof key === "string" && typeof iv === "string") {
                        const env = (0, symmetric_keys_1.symmetricDecrypt)(encrypted, keyBuffer, iv);
                        if (typeof (env) === "string")
                            await (0, setters_1.setEnv)(env);
                        console.log(".env decrypted and updated");
                        return;
                    }
                    else {
                        throw new errors_1.UserError("Failed to parse lock key.");
                    }
                }
                else {
                    throw new errors_1.UserError("Lockbox envelope or encrypted env file is missing or invalid.");
                }
            }
        });
    }));
    return command;
}
//# sourceMappingURL=open.js.map
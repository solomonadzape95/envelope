"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userConfig = exports.UserConfigManager = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const CONFIG_DIR = path_1.default.join(os_1.default.homedir(), '.envelope');
const CONFIG_FILE = path_1.default.join(CONFIG_DIR, 'config.json');
class UserConfigManager {
    config = {};
    async load() {
        try {
            const data = await promises_1.default.readFile(CONFIG_FILE, 'utf-8');
            this.config = JSON.parse(data);
        }
        catch (error) {
            // Config file doesn't exist, use defaults
            this.config = {};
        }
        return this.config;
    }
    async save(config) {
        this.config = { ...this.config, ...config };
        // Ensure config directory exists
        await promises_1.default.mkdir(CONFIG_DIR, { recursive: true });
        await promises_1.default.writeFile(CONFIG_FILE, JSON.stringify(this.config, null, 2));
    }
    get(key) {
        return this.config[key];
    }
    set(key, value) {
        this.config[key] = value;
    }
    async getOrPrompt(key, prompt, defaultValue) {
        const current = this.get(key);
        if (current !== undefined) {
            return current;
        }
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        // This would need to be imported from your inquirer utils
        // const { ask } = await import('../utils/inquirer');
        // const value = await ask(prompt, key as string);
        // this.set(key, value as UserConfig[K]);
        // return value as UserConfig[K];
        throw new Error(`No value for ${key} and no prompt function available`);
    }
}
exports.UserConfigManager = UserConfigManager;
exports.userConfig = new UserConfigManager();
//# sourceMappingURL=user-config.js.map
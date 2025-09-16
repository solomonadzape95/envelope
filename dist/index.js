#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const gen_key_1 = __importDefault(require("./commands/gen-key"));
const lock_1 = __importDefault(require("./commands/lock"));
const open_1 = require("./commands/open");
const share_1 = require("./commands/share");
const signals_1 = require("./utils/signals");
// createTable()
const program = new commander_1.Command();
(0, signals_1.setupSignals)();
program
    .name("envelope")
    .description("Share environment variables securely with cryptographic keys")
    .version("1.1.5");
program.addCommand((0, gen_key_1.default)());
program.addCommand((0, lock_1.default)());
program.addCommand((0, open_1.openEnv)());
program.addCommand((0, share_1.shareKeys)());
program.parse(process.argv);
//# sourceMappingURL=index.js.map
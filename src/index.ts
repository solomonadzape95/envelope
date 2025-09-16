#!/usr/bin/env node
import {Command} from "commander"
import generateKeys from "./commands/gen-key";
import lockEnv from "./commands/lock";
import { openEnv } from "./commands/open";
import { shareKeys } from "./commands/share";
import { pullKeys } from "./commands/pull-keys";
import { update } from "./commands/update";
import { setupSignals } from "./utils/signals";
 
// createTable()

const program = new Command();

setupSignals();

program
.name("envelope")
.description("Share environment variables securely with cryptographic keys")
.version("0.1.0")

program.addCommand(generateKeys())
program.addCommand(lockEnv())
program.addCommand(openEnv())
program.addCommand(shareKeys())
program.addCommand(pullKeys())
program.addCommand(update())

program.parse(process.argv)


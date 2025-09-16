"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultTeamLead = exports.getDefaultProject = exports.getKeyPath = exports.isVerbose = exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config();
exports.config = {
    databaseUrl: process.env.DATABASE_URL || '',
    defaultProject: process.env.ENVELOPE_DEFAULT_PROJECT,
    defaultTeamLead: process.env.ENVELOPE_DEFAULT_TEAM_LEAD,
    keyStoragePath: process.env.ENVELOPE_KEY_PATH || path_1.default.join(os_1.default.homedir(), '.envelope', 'keys'),
    environment: process.env.NODE_ENV || 'development',
    verbose: process.env.ENVELOPE_VERBOSE === 'true'
};
// Validation
if (!exports.config.databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
}
// Helper functions
const isVerbose = () => exports.config.verbose;
exports.isVerbose = isVerbose;
const getKeyPath = () => exports.config.keyStoragePath;
exports.getKeyPath = getKeyPath;
const getDefaultProject = () => exports.config.defaultProject;
exports.getDefaultProject = getDefaultProject;
const getDefaultTeamLead = () => exports.config.defaultTeamLead;
exports.getDefaultTeamLead = getDefaultTeamLead;
//# sourceMappingURL=index.js.map
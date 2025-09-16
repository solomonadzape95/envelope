"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureProjectEnvelopeDir = ensureProjectEnvelopeDir;
exports.getProjectEnvelopePath = getProjectEnvelopePath;
const fs_1 = require("fs");
const path_1 = require("path");
/**
 * Ensures the .envelope directory exists in the current project root
 * and returns the path to it
 */
function ensureProjectEnvelopeDir() {
    const cwd = process.cwd();
    const envelopeDir = (0, path_1.join)(cwd, ".envelope");
    if (!(0, fs_1.existsSync)(envelopeDir)) {
        (0, fs_1.mkdirSync)(envelopeDir, { recursive: true });
    }
    return envelopeDir;
}
/**
 * Gets the path to a file within the project's .envelope directory
 */
function getProjectEnvelopePath(filename) {
    const envelopeDir = ensureProjectEnvelopeDir();
    return (0, path_1.join)(envelopeDir, filename);
}
//# sourceMappingURL=project-envelope.js.map
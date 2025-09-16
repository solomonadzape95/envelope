"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldShowBanner = shouldShowBanner;
exports.markBannerShown = markBannerShown;
const fs_1 = require("fs");
const path_1 = require("path");
function getFlagPath() {
    const home = process.env.HOME || process.env.USERPROFILE || ".";
    const dir = (0, path_1.join)(home, ".envelope");
    if (!(0, fs_1.existsSync)(dir))
        (0, fs_1.mkdirSync)(dir, { recursive: true });
    return (0, path_1.join)(dir, ".first_run_done");
}
function shouldShowBanner() {
    const flag = getFlagPath();
    return !(0, fs_1.existsSync)(flag);
}
function markBannerShown() {
    const flag = getFlagPath();
    try {
        (0, fs_1.writeFileSync)(flag, "1", { encoding: "utf8" });
    }
    catch {
        // ignore failures for UX; CLI should still work
    }
}
//# sourceMappingURL=first-run.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSignals = setupSignals;
function setupSignals() {
    const handle = (signal) => {
        try {
            process.stdout.write("\r\x1b[2K");
        }
        catch { }
        console.error(`Exiting...`);
        process.exitCode = 1;
        process.exit();
    };
    process.on("SIGINT", handle);
    process.on("SIGTERM", handle);
    process.on("uncaughtException", (err) => {
        console.error("Unexpected error:", err?.message || err);
        process.exitCode = 1;
        process.exit();
    });
    process.on("unhandledRejection", (reason) => {
        const message = reason instanceof Error ? reason.message : String(reason);
        console.error("Unhandled rejection:", message);
        process.exitCode = 1;
        process.exit();
    });
}
//# sourceMappingURL=signals.js.map
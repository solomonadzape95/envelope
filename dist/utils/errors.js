"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserError = void 0;
exports.safeAction = safeAction;
class UserError extends Error {
    exitCode;
    constructor(message, exitCode = 1) {
        super(message);
        this.name = "UserError";
        this.exitCode = exitCode;
    }
}
exports.UserError = UserError;
function safeAction(fn) {
    return async (...args) => {
        try {
            await fn(...args);
        }
        catch (err) {
            if (err instanceof UserError) {
                console.error(err.message);
                process.exitCode = err.exitCode;
                return;
            }
            const message = err instanceof Error ? err.message : String(err);
            console.error("Unexpected error:", message);
            process.exitCode = 1;
        }
    };
}
//# sourceMappingURL=errors.js.map
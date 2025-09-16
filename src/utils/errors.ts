export class UserError extends Error {
    public readonly exitCode: number;
    constructor(message: string, exitCode: number = 1) {
        super(message);
        this.name = "UserError";
        this.exitCode = exitCode;
    }
}

export function safeAction<Args extends any[]>(fn: (...args: Args) => Promise<void> | void) {
    return async (...args: Args) => {
        try {
            await fn(...args);
        } catch (err) {
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



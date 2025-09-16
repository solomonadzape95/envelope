export declare class UserError extends Error {
    readonly exitCode: number;
    constructor(message: string, exitCode?: number);
}
export declare function safeAction<Args extends any[]>(fn: (...args: Args) => Promise<void> | void): (...args: Args) => Promise<void>;
//# sourceMappingURL=errors.d.ts.map
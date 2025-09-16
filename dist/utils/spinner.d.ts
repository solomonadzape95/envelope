type SpinnerFrames = string[];
export interface Spinner {
    start: (text?: string) => void;
    succeed: (text?: string) => void;
    fail: (text?: string) => void;
    stop: (text?: string) => void;
    setText: (text: string) => void;
}
export declare function createSpinner(frames?: SpinnerFrames, intervalMs?: number): Spinner;
export declare function withSpinner<T>(message: string, task: () => Promise<T>): Promise<T>;
export {};
//# sourceMappingURL=spinner.d.ts.map
export interface CLIContext {
    currentUser?: string;
    currentProject?: string;
    currentTeamLead?: string;
    isInitialized: boolean;
    verbose: boolean;
    dryRun: boolean;
    workingDirectory: string;
}
declare class CLIContextManager {
    private context;
    set<K extends keyof CLIContext>(key: K, value: CLIContext[K]): void;
    get<K extends keyof CLIContext>(key: K): CLIContext[K];
    getAll(): CLIContext;
    reset(): void;
    setUser(user: string): void;
    setProject(project: string): void;
    setTeamLead(teamLead: string): void;
    isVerbose(): boolean;
    isDryRun(): boolean;
}
export declare const cliContext: CLIContextManager;
export {};
//# sourceMappingURL=cli-context.d.ts.map
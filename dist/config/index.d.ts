export interface GlobalConfig {
    databaseUrl: string;
    defaultProject?: string;
    defaultTeamLead?: string;
    keyStoragePath: string;
    environment: 'development' | 'production' | 'test';
    verbose: boolean;
}
export declare const config: GlobalConfig;
export declare const isVerbose: () => boolean;
export declare const getKeyPath: () => string;
export declare const getDefaultProject: () => string | undefined;
export declare const getDefaultTeamLead: () => string | undefined;
//# sourceMappingURL=index.d.ts.map
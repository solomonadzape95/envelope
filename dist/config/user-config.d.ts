export interface UserConfig {
    username?: string;
    defaultProject?: string;
    defaultTeamLead?: string;
    keyStoragePath?: string;
    autoConfirm?: boolean;
    lastUsedProject?: string;
    lastUsedTeamLead?: string;
}
export declare class UserConfigManager {
    private config;
    load(): Promise<UserConfig>;
    save(config: Partial<UserConfig>): Promise<void>;
    get<K extends keyof UserConfig>(key: K): UserConfig[K];
    set<K extends keyof UserConfig>(key: K, value: UserConfig[K]): void;
    getOrPrompt<K extends keyof UserConfig>(key: K, prompt: string, defaultValue?: UserConfig[K]): Promise<UserConfig[K]>;
}
export declare const userConfig: UserConfigManager;
//# sourceMappingURL=user-config.d.ts.map
export declare function getTeamDetails(): {
    exists: false;
    keys?: never;
} | {
    keys: {
        username: string;
        pub_key: string;
    }[];
    exists: true;
};
export default function getUserDetails(): {
    priv_key: string | null;
    pub_key: string | null;
    username: string | null;
    exists: boolean;
    dir: string;
};
export declare function getEnvDetails(): {
    exists: false;
    fileContent?: never;
} | {
    fileContent: string;
    exists: true;
};
export declare function getLockboxes(): {
    exists: false;
    lockbox?: never;
} | {
    exists: boolean;
    lockbox: {
        username: string;
        envelope: string;
    };
};
export declare function getEncryptedEnv(): {
    exists: false;
    fileContent?: never;
} | {
    fileContent: string;
    exists: true;
};
//# sourceMappingURL=getters.d.ts.map
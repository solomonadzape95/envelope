export interface ShareRecordCreateRequest {
    shared_by: string;
    shared_to: string;
    pub_key: string;
    project: string;
}
export interface ShareRecordResponse {
    id: number;
    shared_by: string;
    shared_to: string;
    pub_key: string;
    project: string;
}
export interface ApiClientConfig {
    baseUrl?: string;
}
export declare class ApiClient {
    private readonly baseUrl;
    constructor(cfg?: ApiClientConfig);
    createShareRecord(payload: ShareRecordCreateRequest): Promise<ShareRecordResponse>;
    listShareRecords(filters?: {
        project?: string;
        shared_by?: string;
    }): Promise<ShareRecordResponse[]>;
}
//# sourceMappingURL=api.d.ts.map
import https from "https";
import http from "http";

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
    baseUrl?: string; // default http://127.0.0.1:8000
}

function request<T>(method: string, urlStr: string, body?: unknown): Promise<T> {
    return new Promise((resolve, reject) => {
        const isHttps = urlStr.startsWith("https://");
        const lib = isHttps ? https : http;
        const urlObj = new URL(urlStr);
        const data = body ? Buffer.from(JSON.stringify(body), "utf8") : undefined;
        const req = lib.request({
            hostname: urlObj.hostname,
            port: urlObj.port || (isHttps ? 443 : 80),
            path: urlObj.pathname + (urlObj.search || ""),
            method,
            headers: {
                "Content-Type": "application/json",
                ...(data ? { "Content-Length": String(data.length) } : {})
            }
        }, (res) => {
            const chunks: Buffer[] = [];
            res.on("data", (c) => chunks.push(typeof c === "string" ? Buffer.from(c) : c));
            res.on("end", () => {
                const text = Buffer.concat(chunks).toString("utf8");
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    try { resolve(text ? JSON.parse(text) as T : (undefined as unknown as T)); }
                    catch { resolve(undefined as unknown as T); }
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${text || 'No response body'}`));
                }
            });
        });
        req.on("error", reject);
        if (data) req.write(data);
        req.end();
    });
}

export class ApiClient {
    private readonly baseUrl: string;
    constructor(cfg?: ApiClientConfig){
        this.baseUrl = (cfg?.baseUrl || process.env.ENVELOPE_API_BASE || "https://questions-a8ul.onrender.com").replace(/\/$/,"");
    }
    async createShareRecord(payload: ShareRecordCreateRequest): Promise<ShareRecordResponse>{
        try {
            return await request<ShareRecordResponse>("POST", `${this.baseUrl}/share-records`, payload);
        } catch (error) {
            console.error(`API Error creating share record:`, error);
            throw error;
        }
    }
    async listShareRecords(filters?: { project?: string; shared_by?: string; }): Promise<ShareRecordResponse[]>{
        try {
            const qs = new URLSearchParams();
            if(filters?.project) qs.set("project", filters.project);
            if(filters?.shared_by) qs.set("shared_by", filters.shared_by);
            const url = `${this.baseUrl}/share-records${qs.toString() ? `?${qs.toString()}` : ""}`;
            return await request<ShareRecordResponse[]>("GET", url);
        } catch (error) {
            console.error(`API Error listing share records:`, error);
            throw error;
        }
    }
}



"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
function request(method, urlStr, body) {
    return new Promise((resolve, reject) => {
        const isHttps = urlStr.startsWith("https://");
        const lib = isHttps ? https_1.default : http_1.default;
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
            const chunks = [];
            res.on("data", (c) => chunks.push(typeof c === "string" ? Buffer.from(c) : c));
            res.on("end", () => {
                const text = Buffer.concat(chunks).toString("utf8");
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(text ? JSON.parse(text) : undefined);
                    }
                    catch {
                        resolve(undefined);
                    }
                }
                else {
                    reject(new Error(`HTTP ${res.statusCode}: ${text || 'No response body'}`));
                }
            });
        });
        req.on("error", reject);
        if (data)
            req.write(data);
        req.end();
    });
}
class ApiClient {
    baseUrl;
    constructor(cfg) {
        this.baseUrl = (cfg?.baseUrl || process.env.ENVELOPE_API_BASE || "https://questions-a8ul.onrender.com").replace(/\/$/, "");
    }
    async createShareRecord(payload) {
        try {
            return await request("POST", `${this.baseUrl}/share-records`, payload);
        }
        catch (error) {
            console.error(`API Error creating share record:`, error);
            throw error;
        }
    }
    async listShareRecords(filters) {
        try {
            const qs = new URLSearchParams();
            if (filters?.project)
                qs.set("project", filters.project);
            if (filters?.shared_by)
                qs.set("shared_by", filters.shared_by);
            const url = `${this.baseUrl}/share-records${qs.toString() ? `?${qs.toString()}` : ""}`;
            return await request("GET", url);
        }
        catch (error) {
            console.error(`API Error listing share records:`, error);
            throw error;
        }
    }
}
exports.ApiClient = ApiClient;
//# sourceMappingURL=api.js.map
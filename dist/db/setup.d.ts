import { PoolClient } from "pg";
import "dotenv/config";
export declare function withTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T>;
//# sourceMappingURL=setup.d.ts.map
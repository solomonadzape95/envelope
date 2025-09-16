"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTransaction = withTransaction;
const pg_1 = require("pg");
require("dotenv/config");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});
async function withTransaction(callback) {
    const client = await pool.connect();
    try {
        return await callback(client);
    }
    finally {
        client.release();
    }
}
process.on("SIGINT", async () => {
    await pool.end();
    process.exit(0);
});
//# sourceMappingURL=setup.js.map
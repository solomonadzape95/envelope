"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTable = createTable;
const setup_1 = require("./setup");
async function createTable() {
    await (0, setup_1.withTransaction)(async (client) => {
        // Check if the table exists
        const tableExistsResult = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'share_records'
            ) AS exists;
        `);
        const tableExists = tableExistsResult.rows[0]?.exists;
        let canDrop = false;
        if (tableExists) {
            // Check if the table is empty
            const countResult = await client.query(`SELECT COUNT(*) FROM share_records;`);
            const rowCount = parseInt(countResult.rows[0].count, 10);
            if (rowCount === 0) {
                canDrop = true;
            }
        }
        else {
            // Table does not exist, so we can "drop" (no-op) and create
            canDrop = true;
        }
        if (canDrop) {
            await client.query(`DROP TABLE IF EXISTS share_records;`);
            const table = await client.query(`
                CREATE TABLE share_records (
                    id SERIAL PRIMARY KEY,
                    pub_key VARCHAR(255),
                    shared_by VARCHAR(255),
                    shared_to VARCHAR(255),
                    project VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
            console.log("Table created.", table);
        }
        else {
            console.log("Table 'share_records' not dropped because it is not empty.");
        }
    });
}
//# sourceMappingURL=create_table.js.map
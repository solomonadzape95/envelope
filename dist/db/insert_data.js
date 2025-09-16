"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertData = insertData;
const setup_1 = require("./setup");
async function insertData(data) {
    if (!data || data.length === 0) {
        throw new Error("No data provided for insertion");
    }
    try {
        await (0, setup_1.withTransaction)(async (client) => {
            for (const record of data) {
                if (!record.pub_key || !record.shared_by || !record.shared_to || !record.project) {
                    throw new Error("Missing fields for data insertion");
                }
                await client.query(`
            INSERT INTO share_records (pub_key, shared_by, shared_to, project)
            VALUES ($1,$2,$3,$4);`, [record.pub_key, record.shared_by, record.shared_to, record.project]);
                console.log(`Public key for ${record.shared_by} successfully shared to ${record.shared_to} for ${record.project}`);
            }
        });
    }
    catch (error) {
        throw new Error(`Database insertion failed: ${error.message}`);
    }
}
//# sourceMappingURL=insert_data.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readData = readData;
const setup_1 = require("./setup");
async function readData(project, username) {
    if (!project || project === "") {
        throw new Error("No project name provided. Please provide project name.");
    }
    return await (0, setup_1.withTransaction)(async (client) => {
        const { rows } = await client.query(`SELECT * FROM share_records WHERE shared_to = $1 AND project = $2`, [username, project]);
        if (rows.length === 0) {
            return "No rows found for the specified data";
        }
        return rows;
    });
}
//# sourceMappingURL=read_data.js.map
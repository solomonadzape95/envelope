import { withTransaction } from "./setup"

export async function readData(project: string, username: string) {
    if (!project || project === "") {
        throw new Error("No project name provided. Please provide project name.");
    }
    return await withTransaction(async (client: any) => {
        const { rows } = await client.query(
            `SELECT * FROM share_records WHERE shared_to = $1 AND project = $2`,
            [username, project]
        );
        if (rows.length === 0) {
            return "No rows found for the specified data";
        }
        return rows;
    });
}
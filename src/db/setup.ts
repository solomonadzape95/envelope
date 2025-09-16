import { Pool, PoolClient } from "pg";
import "dotenv/config"

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
})

export async function withTransaction<T>(callback: (client: PoolClient) => Promise<T>) : Promise<T>{
    const client = await pool.connect();
    try{
        return await callback(client);
    }finally{
        client.release()
    }
}
process.on("SIGINT", async () => {
    await pool.end();
    process.exit(0)
})
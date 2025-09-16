import { ShareRecord } from "../types";
import { withTransaction } from "./setup";

export async function insertData(data : ShareRecord[]){
    if(!data || data.length === 0){
        throw new Error("No data provided for insertion")
    }
    try{
      await withTransaction(async (client: any) => {
    for(const record of data){
        if(!record.pub_key || !record.shared_by || !record.shared_to || !record.project){
            throw new Error("Missing fields for data insertion")
        }
        await client.query(`
            INSERT INTO share_records (pub_key, shared_by, shared_to, project)
            VALUES ($1,$2,$3,$4);`, 
        [record.pub_key, record.shared_by, record.shared_to, record.project])
        console.log(`Public key for ${record.shared_by} successfully shared to ${record.shared_to} for ${record.project}`)
    }
});  
    }catch(error : any){
        throw new Error(`Database insertion failed: ${error.message as string}`)
    }


}
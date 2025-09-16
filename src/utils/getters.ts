import { existsSync, readFileSync } from "fs";
import { join } from "path";

export function getTeamDetails(){
    const cwd = process.cwd();
    const path = join(cwd, '.envelope', 'envelope_keys.txt');
    const exists = existsSync(path);
    if (!exists) return { exists };
    const fileContent = readFileSync(path, { encoding: "utf8" });

    
    // Split by lines that start with a username (no leading whitespace and contains =)
    const lines = fileContent.split("\n");
    const keys: { username: string, pub_key: string }[] = [];
    let currentKey: { username: string, pub_key: string } | null = null;
    
    for (const line of lines) {
        if (line.trim() === "") continue;
        
        // Check if this line starts a new key (contains = and doesn't start with whitespace)
        if (line.includes("=") && !line.startsWith(" ") && !line.startsWith("\t")) {
            // Save previous key if exists
            if (currentKey && currentKey.username && currentKey.pub_key) {
                keys.push(currentKey);
            }
            
            // Start new key
            const equalIndex = line.indexOf("=");
            const username = line.substring(0, equalIndex);
            const pub_key = line.substring(equalIndex + 1);
            currentKey = { username, pub_key };
        } else if (currentKey) {
            // This is a continuation of the current key
            currentKey.pub_key += "\n" + line;
        }
    }
    
    // Add the last key if it exists
    if (currentKey && currentKey.username && currentKey.pub_key) {
        keys.push(currentKey);
    }

    return { keys, exists };
}

export default function getUserDetails() {
    const dir = join(process.env.HOME || process.env.USERPROFILE || ".", ".envelope");
    let exists = existsSync(dir) 

    const pubPath = join(dir, "id_rsa.pub");
    const privPath = join(dir, "id_rsa");
    const namePath = join(dir, "username.txt");

    let pub_key: string | null = null;
    let priv_key: string | null = null;
    let username: string | null = null;

    try {
        pub_key = readFileSync(pubPath, "utf-8") || null;
    } catch (err) {
        // File not found or cannot be read
        pub_key = null;
    }

    try {
        priv_key = readFileSync(privPath, "utf-8") || null;
    } catch (err) {
        priv_key = null;
    }

    try {
        username = readFileSync(namePath, "utf-8").trim() || null;
    } catch (err) {
        username = null;
    }

    return { priv_key, pub_key, username, exists, dir };
}

export function getEnvDetails(){
    const cwd = process.cwd()
    const path = `${cwd}/.env`
    const exists = existsSync(path)
    if (!exists) return { exists }
    const fileContent = readFileSync(path, { encoding: "utf8" });
   
    return {fileContent, exists}
}

export function getLockboxes(){
    const cwd = process.cwd()
    const path = join(cwd, '.envelope', 'envelopes.txt')
    const exists = existsSync(path)
    if (!exists) return { exists }
    const fileContent = readFileSync(path, { encoding: "utf8" });
    if (!fileContent.trim()) {
        return { exists: false, lockbox: { username: "", envelope: "" } };
    }
    
    const { username: user } = getUserDetails();

    const lockbox = fileContent
        .split("\n")
        .filter(line => line.trim().length > 0)
        .map(line => {
            const cleaned = line.endsWith("__") ? line.slice(0, -2) : line;
        const [username, envelope] = cleaned.split("=");
        if(username === user){
           if (typeof username === "string" && typeof envelope === "string") {
            return { username, envelope };
        }  
        }else {
            return { username: "", envelope: "" };
        } 
    })[0] || { username: "", envelope: "" }
    return {lockbox, exists}
}
export function getEncryptedEnv(){
    const cwd = process.cwd()
    const path = join(cwd, '.envelope', 'envelope_enc.txt')
    const exists = existsSync(path)
    if (!exists) return { exists }
    const fileContent = readFileSync(path, { encoding: "utf8" });
   
    return {fileContent, exists}

}
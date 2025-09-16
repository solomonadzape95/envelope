import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

function getFlagPath(): string {
    const home = process.env.HOME || process.env.USERPROFILE || ".";
    const dir = join(home, ".envelope");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    return join(dir, ".first_run_done");
}

export function shouldShowBanner(): boolean {
    const flag = getFlagPath();
    return !existsSync(flag);
}

export function markBannerShown(): void {
    const flag = getFlagPath();
    try {
        writeFileSync(flag, "1", { encoding: "utf8" });
    } catch {
        // ignore failures for UX; CLI should still work
    }
}



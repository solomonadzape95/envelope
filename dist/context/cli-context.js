"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cliContext = void 0;
class CLIContextManager {
    context = {
        isInitialized: false,
        verbose: false,
        dryRun: false,
        workingDirectory: process.cwd()
    };
    set(key, value) {
        this.context[key] = value;
    }
    get(key) {
        return this.context[key];
    }
    getAll() {
        return { ...this.context };
    }
    reset() {
        this.context = {
            isInitialized: false,
            verbose: false,
            dryRun: false,
            workingDirectory: process.cwd()
        };
    }
    // Helper methods
    setUser(user) {
        this.set('currentUser', user);
        this.set('isInitialized', true);
    }
    setProject(project) {
        this.set('currentProject', project);
    }
    setTeamLead(teamLead) {
        this.set('currentTeamLead', teamLead);
    }
    isVerbose() {
        return this.get('verbose');
    }
    isDryRun() {
        return this.get('dryRun');
    }
}
exports.cliContext = new CLIContextManager();
//# sourceMappingURL=cli-context.js.map
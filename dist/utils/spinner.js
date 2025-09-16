"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSpinner = createSpinner;
exports.withSpinner = withSpinner;
const defaultFrames = [
    "⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"
];
function createSpinner(frames = defaultFrames, intervalMs = 80) {
    const state = {
        intervalId: null,
        text: "",
        frameIndex: 0
    };
    function render(line) {
        process.stdout.write(`\r${line}`);
    }
    function clearLine() {
        process.stdout.write("\r\x1b[2K");
    }
    function start(text) {
        if (text)
            state.text = text;
        if (state.intervalId)
            return;
        state.intervalId = setInterval(() => {
            const frame = frames[state.frameIndex % frames.length];
            state.frameIndex += 1;
            render(`${frame} ${state.text}`);
        }, intervalMs);
    }
    function stop(finalText) {
        if (state.intervalId) {
            clearInterval(state.intervalId);
            state.intervalId = null;
        }
        clearLine();
        if (finalText)
            render(finalText + "\n");
    }
    function succeed(text) {
        stop(text ?? `✔ ${state.text}`);
    }
    function fail(text) {
        stop(text ?? `✖ ${state.text}`);
    }
    function setText(text) {
        state.text = text;
    }
    return { start, succeed, fail, stop, setText };
}
async function withSpinner(message, task) {
    const spinner = createSpinner();
    spinner.start(message);
    try {
        const result = await task();
        spinner.succeed(`✔ ${message}`);
        return result;
    }
    catch (error) {
        spinner.fail(`✖ ${message}`);
        throw error;
    }
}
//# sourceMappingURL=spinner.js.map
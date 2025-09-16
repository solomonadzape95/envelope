type SpinnerFrames = string[];

export interface Spinner {
    start: (text?: string) => void;
    succeed: (text?: string) => void;
    fail: (text?: string) => void;
    stop: (text?: string) => void;
    setText: (text: string) => void;
}

interface InternalSpinnerState {
    intervalId: NodeJS.Timeout | null;
    text: string;
    frameIndex: number;
}

const defaultFrames: SpinnerFrames = [
    "⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"
];

export function createSpinner(frames: SpinnerFrames = defaultFrames, intervalMs: number = 80): Spinner {
    const state: InternalSpinnerState = {
        intervalId: null,
        text: "",
        frameIndex: 0
    };

    function render(line: string) {
        process.stdout.write(`\r${line}`);
    }

    function clearLine() {
        process.stdout.write("\r\x1b[2K");
    }

    function start(text?: string) {
        if (text) state.text = text;
        if (state.intervalId) return;
        state.intervalId = setInterval(() => {
            const frame = frames[state.frameIndex % frames.length];
            state.frameIndex += 1;
            render(`${frame} ${state.text}`);
        }, intervalMs);
    }

    function stop(finalText?: string) {
        if (state.intervalId) {
            clearInterval(state.intervalId);
            state.intervalId = null;
        }
        clearLine();
        if (finalText) render(finalText + "\n");
    }

    function succeed(text?: string) {
        stop(text ?? `✔ ${state.text}`);
    }

    function fail(text?: string) {
        stop(text ?? `✖ ${state.text}`);
    }

    function setText(text: string) {
        state.text = text;
    }

    return { start, succeed, fail, stop, setText };
}

export async function withSpinner<T>(message: string, task: () => Promise<T>): Promise<T> {
    const spinner = createSpinner();
    spinner.start(message);
    try {
        const result = await task();
        spinner.succeed(`✔ ${message}`);
        return result;
    } catch (error) {
        spinner.fail(`✖ ${message}`);
        throw error;
    }
}



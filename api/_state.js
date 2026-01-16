// Simple in-memory state (shared across all API functions)
// In production, use Redis or a database

global.appState = global.appState || {
    ledState: "off",
    logs: [],
    lastHeartbeat: null
};

function getState() {
    return global.appState;
}

function setState(key, value) {
    global.appState[key] = value;
}

function addLog(source, msg) {
    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
    const entry = {
        time: timestamp,
        source,
        msg,
        id: Date.now()
    };

    global.appState.logs.push(entry);
    if (global.appState.logs.length > 500) {
        global.appState.logs.shift();
    }

    console.log(`[${timestamp}] ${source}: ${msg}`);
}

module.exports = { getState, setState, addLog };

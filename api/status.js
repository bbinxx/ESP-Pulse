const { getState } = require('./_state');

module.exports = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method === "GET") {
        const state = getState();
        const now = Date.now();
        const isOnline = state.lastHeartbeat && (now - state.lastHeartbeat) < 10000; // 10 sec timeout

        return res.json({
            online: isOnline,
            ledState: state.ledState,
            lastSeen: state.lastHeartbeat ? new Date(state.lastHeartbeat).toISOString() : null
        });
    }

    return res.status(405).json({ error: "Method not allowed" });
};

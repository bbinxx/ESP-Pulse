const { setState, addLog } = require('./_state');

module.exports = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method === "POST") {
        const { msg } = req.body;

        // Update heartbeat when ESP sends log
        setState('lastHeartbeat', Date.now());

        addLog("ESP", msg);
        return res.json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
};

const { getState, setState, addLog } = require('./_state');

module.exports = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method === "POST") {
        const { state } = req.body;
        const currentState = getState();
        const prevState = currentState.ledState;

        setState('ledState', state);

        if (prevState !== state) {
            addLog("WEB", `LED changed: ${prevState} → ${state}`);
        }

        return res.json({ ok: true, state: state });
    }

    return res.status(405).json({ error: "Method not allowed" });
};

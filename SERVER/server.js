const express = require("express");
const app = express();
app.use(express.json());

let ledState = "off";
let logs = [];

app.post("/set", (req, res) => {
  ledState = req.body.state;
  addLog("WEB", `LED set to ${ledState}`);
  res.json({ ok: true });
});

app.get("/get", (req, res) => {
  res.json({ led: ledState });
});

app.post("/log", (req, res) => {
  const msg = req.body.msg;
  addLog("ESP", msg);
  res.json({ ok: true });
});

app.get("/logs", (req, res) => {
  res.json(logs.slice(-50)); // last 50 logs
});

function addLog(from, msg) {
  const time = new Date().toLocaleTimeString();
  logs.push({ time, from, msg });
  if (logs.length > 200) logs.shift();
  console.log(`[${time}] ${from}: ${msg}`);
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(3000, () => console.log("Server running on port 3000"));

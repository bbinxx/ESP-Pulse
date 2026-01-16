-- ESP8266 Control System Database Schema
-- This file is automatically executed by db.js on startup

-- State table: stores key-value pairs for app state
CREATE TABLE IF NOT EXISTS state (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at INTEGER
);

-- Logs table: stores activity logs from ESP and web dashboard
CREATE TABLE IF NOT EXISTS logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT,
  source TEXT,
  message TEXT,
  created_at INTEGER
);

-- Initialize default state
INSERT OR IGNORE INTO state (key, value, updated_at)
VALUES ('ledState', 'off', strftime('%s', 'now') * 1000);

-- Example queries:
-- Get LED state: SELECT value FROM state WHERE key = 'ledState';
-- Get recent logs: SELECT * FROM logs ORDER BY id DESC LIMIT 100;
-- Check heartbeat: SELECT value FROM state WHERE key = 'lastHeartbeat';

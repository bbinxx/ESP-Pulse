const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/app.db');

// Initialize database
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to SQLite database');
        initDatabase();
    }
});

function initDatabase() {
    db.serialize(() => {
        // State table
        db.run(`
      CREATE TABLE IF NOT EXISTS state (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at INTEGER
      )
    `);

        // Logs table
        db.run(`
      CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT,
        source TEXT,
        message TEXT,
        created_at INTEGER
      )
    `);

        // Initialize default state
        db.run(`
      INSERT OR IGNORE INTO state (key, value, updated_at)
      VALUES ('ledState', 'off', ?)
    `, [Date.now()]);
    });
}

function getState(key, callback) {
    db.get('SELECT value FROM state WHERE key = ?', [key], (err, row) => {
        if (err) callback(err, null);
        else callback(null, row ? row.value : null);
    });
}

function setState(key, value, callback) {
    db.run(
        'INSERT OR REPLACE INTO state (key, value, updated_at) VALUES (?, ?, ?)',
        [key, value, Date.now()],
        callback
    );
}

function addLog(source, message, callback) {
    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
    db.run(
        'INSERT INTO logs (timestamp, source, message, created_at) VALUES (?, ?, ?, ?)',
        [timestamp, source, message, Date.now()],
        (err) => {
            if (err) callback(err);
            else {
                // Update heartbeat
                setState('lastHeartbeat', Date.now().toString(), callback);
            }
        }
    );
}

function getLogs(limit, callback) {
    db.all(
        'SELECT timestamp as time, source, message as msg FROM logs ORDER BY id DESC LIMIT ?',
        [limit],
        (err, rows) => {
            if (err) callback(err, null);
            else callback(null, rows.reverse());
        }
    );
}

function getHeartbeat(callback) {
    getState('lastHeartbeat', (err, value) => {
        if (err) callback(err, null);
        else callback(null, value ? parseInt(value) : null);
    });
}

module.exports = { getState, setState, addLog, getLogs, getHeartbeat };

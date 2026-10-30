const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'data', 'app.db');

if (dbPath !== ':memory:') {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

const db = new Database(dbPath === ':memory:' ? ':memory:' : dbPath);
db.pragma('journal_mode = WAL');

db.prepare(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`).run();

function getMetrics() {
  const totalMessages = db.prepare('SELECT COUNT(*) AS count FROM messages').get().count;
  const lastMessage = db.prepare(`
    SELECT author, message, created_at AS createdAt
    FROM messages
    ORDER BY id DESC
    LIMIT 1
  `).get();

  return {
    service: 'platform-dashboard',
    status: 'ready',
    totalMessages,
    lastUpdated: lastMessage ? lastMessage.createdAt : null,
    latestMessage: lastMessage ? `${lastMessage.author}: ${lastMessage.message}` : 'No messages yet',
  };
}

function getMessages() {
  return db.prepare(`
    SELECT id, author, message, created_at AS createdAt
    FROM messages
    ORDER BY id DESC
    LIMIT 20
  `).all();
}

function createMessage({ author, message }) {
  const stmt = db.prepare('INSERT INTO messages (author, message) VALUES (?, ?)');
  const result = stmt.run(author, message);

  return db.prepare(`
    SELECT id, author, message, created_at AS createdAt
    FROM messages
    WHERE id = ?
  `).get(result.lastInsertRowid);
}

function healthStatus() {
  return {
    status: 'connected',
    path: dbPath,
    messageCount: db.prepare('SELECT COUNT(*) AS count FROM messages').get().count,
  };
}

module.exports = {
  createMessage,
  getMessages,
  getMetrics,
  healthStatus,
};

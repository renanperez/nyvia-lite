const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../db/nyvia.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');
// Inicializa o banco de dados com as tabelas necessárias
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      plan TEXT DEFAULT 'starter',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS workspaces (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workspace_id INTEGER NOT NULL,
      title TEXT DEFAULT 'Nova Análise',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id INTEGER NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );

    DROP TABLE IF EXISTS artifacts;
    CREATE TABLE IF NOT EXISTS artifacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workspace_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_type TEXT,
      file_size INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
    );
  `);
  console.log('✅ Banco de dados inicializado');
}

initDatabase();
// Funções de acesso ao banco de dados
module.exports = {
  db,
  isConnected: () => {
    try {
      db.prepare('SELECT 1').get();
      return true;
    } catch {
      return false;
    }
  },
  createUser: (email, passwordHash, name) => {
    const stmt = db.prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)');
    return stmt.run(email, passwordHash, name).lastInsertRowid;
  },
  getUserByEmail: (email) => {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },
  getUserById: (id) => {
    return db.prepare('SELECT id, email, name, plan FROM users WHERE id = ?').get(id);
  },
  createWorkspace: (userId, name, description) => {
    const stmt = db.prepare('INSERT INTO workspaces (user_id, name, description) VALUES (?, ?, ?)');
    return stmt.run(userId, name, description).lastInsertRowid;
  },
  getWorkspacesByUser: (userId) => {
    return db.prepare('SELECT * FROM workspaces WHERE user_id = ?').all(userId);
  },
  getWorkspaceById: (id) => {
    return db.prepare('SELECT * FROM workspaces WHERE id = ?').get(id);
  },
  createConversation: (workspaceId, title) => {
    const stmt = db.prepare('INSERT INTO conversations (workspace_id, title) VALUES (?, ?)');
    return stmt.run(workspaceId, title).lastInsertRowid;
  },
  addMessage: (conversationId, role, content) => {
    const stmt = db.prepare('INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)');
    return stmt.run(conversationId, role, content).lastInsertRowid;
  },
  getConversationHistory: (conversationId) => {
    return db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at').all(conversationId);
  },
  createArtifact: (workspaceId, filename, originalName, filePath, fileType, fileSize) => {
    const stmt = db.prepare('INSERT INTO artifacts (workspace_id, filename, original_name, file_path, file_type, file_size) VALUES (?, ?, ?, ?, ?, ?)');
    return stmt.run(workspaceId, filename, originalName, filePath, fileType, fileSize).lastInsertRowid;
  },
  getArtifactsByWorkspace: (workspaceId) => {
    return db.prepare('SELECT * FROM artifacts WHERE workspace_id = ? ORDER BY created_at DESC').all(workspaceId);
  },
  getArtifactById: (id) => {
    return db.prepare('SELECT * FROM artifacts WHERE id = ?').get(id);
  },
  deleteArtifact: (id) => {
    return db.prepare('DELETE FROM artifacts WHERE id = ?').run(id);
  }
}; // module.exports
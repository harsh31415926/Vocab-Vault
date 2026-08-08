const path = require('path');
const fs = require('fs');
require('dotenv').config();

// ================================================================
// DUAL-MODE DATABASE LAYER
// 
// When DATABASE_URL is set → connects to PostgreSQL (production)
// When DATABASE_URL is NOT set → uses SQLite (local development)
//
// Both modes export the exact same interface:
//   dbRun(sql, params)  → { id, changes }
//   dbGet(sql, params)  → row or undefined
//   dbAll(sql, params)  → [rows]
// ================================================================

const DATABASE_URL = process.env.DATABASE_URL;

let dbRun, dbGet, dbAll;

if (DATABASE_URL) {
  // ========================
  // POSTGRESQL MODE (Production)
  // ========================
  const { Pool } = require('pg');

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for most cloud PostgreSQL hosts
  });

  pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
  });

  pool.on('error', (err) => {
    console.error('PostgreSQL pool error:', err.message);
  });

  // Convert SQLite-style "?" placeholders to PostgreSQL "$1, $2, ..." style
  const convertPlaceholders = (sql) => {
    let index = 0;
    return sql.replace(/\?/g, () => {
      index++;
      return `$${index}`;
    });
  };

  // Convert SQLite-style SQL to PostgreSQL-compatible SQL
  const convertSQL = (sql) => {
    let converted = convertPlaceholders(sql);

    // Replace INTEGER PRIMARY KEY AUTOINCREMENT with SERIAL PRIMARY KEY
    converted = converted.replace(
      /INTEGER\s+PRIMARY\s+KEY\s+AUTOINCREMENT/gi,
      'SERIAL PRIMARY KEY'
    );

    // Replace DATETIME with TIMESTAMP
    converted = converted.replace(/\bDATETIME\b/gi, 'TIMESTAMP');

    // Replace CURRENT_TIMESTAMP in DEFAULT clauses (PostgreSQL uses NOW())
    // Keep CURRENT_TIMESTAMP as-is since PostgreSQL also supports it

    return converted;
  };

  const initializeDatabase = async () => {
    try {
      // Create Users Table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Vocabularies Table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS vocabularies (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          word TEXT NOT NULL,
          meaning TEXT NOT NULL,
          synonyms TEXT,
          examples TEXT,
          tags TEXT,
          notes TEXT,
          is_favorite INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `);

      console.log('PostgreSQL tables initialized successfully');
    } catch (err) {
      console.error('Error initializing PostgreSQL tables:', err.message);
    }
  };

  initializeDatabase();

  // dbRun: Execute INSERT/UPDATE/DELETE
  // Returns { id: lastInsertId, changes: rowCount }
  dbRun = async (sql, params = []) => {
    const converted = convertSQL(sql);
    const isInsert = /^\s*INSERT/i.test(sql);

    let finalSQL = converted;
    if (isInsert && !/RETURNING/i.test(converted)) {
      finalSQL = converted + ' RETURNING id';
    }

    const result = await pool.query(finalSQL, params);
    return {
      id: (result.rows && result.rows[0]) ? result.rows[0].id : null,
      changes: result.rowCount
    };
  };

  // dbGet: Fetch a single row
  dbGet = async (sql, params = []) => {
    const converted = convertSQL(sql);
    const result = await pool.query(converted, params);
    return result.rows[0] || undefined;
  };

  // dbAll: Fetch all rows
  dbAll = async (sql, params = []) => {
    const converted = convertSQL(sql);
    const result = await pool.query(converted, params);
    return result.rows;
  };

} else {
  // ========================
  // SQLITE MODE (Local Development)
  // ========================
  const sqlite3 = require('sqlite3').verbose();

  const dbPath = path.resolve(__dirname, process.env.DATABASE_FILE || 'vocab.db');

  // Ensure database file directory exists
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
    } else {
      console.log(`Connected to SQLite database at: ${dbPath}`);
      initializeSQLiteDatabase();
    }
  });

  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');

  function initializeSQLiteDatabase() {
    db.serialize(() => {
      // 1. Create Users Table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.error('Error creating users table:', err.message);
      });

      // 2. Create Vocabularies Table
      db.run(`
        CREATE TABLE IF NOT EXISTS vocabularies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          word TEXT NOT NULL,
          meaning TEXT NOT NULL,
          synonyms TEXT,
          examples TEXT,
          tags TEXT,
          notes TEXT,
          is_favorite INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) console.error('Error creating vocabularies table:', err.message);
      });
    });
  }

  // Promise wrappers for DB operations to enable async/await
  dbRun = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  };

  dbGet = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  };

  dbAll = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  };
}

module.exports = {
  dbRun,
  dbGet,
  dbAll
};

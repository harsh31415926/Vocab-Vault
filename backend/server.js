const express = require('express');
const cors = require('cors');
const { dbAll, dbGet, dbRun } = require('./database');
const { authenticateToken, register, login } = require('./auth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://vocab-vault-git-main-harsh31415926s-projects.vercel.app",
    "https://vocab-vault-lzvf7prra-harsh31415926s-projects.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

// Log API requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ==========================
// AUTH ROUTES
// ==========================

app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// ==========================
// HELPERS
// ==========================

const parseVocabRow = (row) => {
  if (!row) return null;

  try {
    return {
      ...row,
      is_favorite: row.is_favorite === 1,
      synonyms: row.synonyms ? JSON.parse(row.synonyms) : [],
      examples: row.examples ? JSON.parse(row.examples) : [],
      tags: row.tags ? JSON.parse(row.tags) : []
    };
  } catch (err) {
    console.error(err);

    return {
      ...row,
      is_favorite: row.is_favorite === 1,
      synonyms: [],
      examples: [],
      tags: []
    };
  }
};

// ==========================
// VOCAB ROUTES
// ==========================

// Get all vocabularies
app.get('/api/vocabularies', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { search, favorite, tag, limit, offset } = req.query;

  let query = 'SELECT * FROM vocabularies WHERE user_id = ?';
  const params = [userId];

  if (favorite === 'true') {
    query += ' AND is_favorite = 1';
  }

  if (tag) {
    query += ' AND tags LIKE ?';
    params.push(`%"${tag}"%`);
  }

  if (search) {
    query +=
      ' AND (word LIKE ? OR meaning LIKE ? OR synonyms LIKE ? OR notes LIKE ? OR tags LIKE ?)';

    const s = `%${search}%`;

    params.push(s, s, s, s, s);
  }

  query += ' ORDER BY created_at DESC';

  if (limit) {
    query += ' LIMIT ?';
    params.push(parseInt(limit));

    if (offset) {
      query += ' OFFSET ?';
      params.push(parseInt(offset));
    }
  }

  try {
    const rows = await dbAll(query, params);
    res.json(rows.map(parseVocabRow));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch vocabularies.' });
  }
});

// Get one vocabulary
app.get('/api/vocabularies/:id', authenticateToken, async (req, res) => {
  try {
    const row = await dbGet(
      'SELECT * FROM vocabularies WHERE id=? AND user_id=?',
      [req.params.id, req.user.userId]
    );

    if (!row) {
      return res.status(404).json({ error: 'Vocabulary not found.' });
    }

    res.json(parseVocabRow(row));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed.' });
  }
});

// Create vocabulary
app.post('/api/vocabularies', authenticateToken, async (req, res) => {
  const {
    word,
    meaning,
    synonyms,
    examples,
    tags,
    notes,
    is_favorite
  } = req.body;

  if (!word || !meaning) {
    return res.status(400).json({
      error: 'Word and meaning are required.'
    });
  }

  try {
    const result = await dbRun(
      `INSERT INTO vocabularies
      (user_id,word,meaning,synonyms,examples,tags,notes,is_favorite,created_at,updated_at)
      VALUES(?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
      [
        req.user.userId,
        word.trim(),
        meaning.trim(),
        JSON.stringify(synonyms || []),
        JSON.stringify(examples || []),
        JSON.stringify(tags || []),
        notes || '',
        is_favorite ? 1 : 0
      ]
    );

    const vocab = await dbGet(
      'SELECT * FROM vocabularies WHERE id=?',
      [result.id]
    );

    res.status(201).json(parseVocabRow(vocab));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed.' });
  }
});

// Update vocabulary
app.put('/api/vocabularies/:id', authenticateToken, async (req, res) => {
  const {
    word,
    meaning,
    synonyms,
    examples,
    tags,
    notes,
    is_favorite
  } = req.body;

  try {

    const existing = await dbGet(
      'SELECT * FROM vocabularies WHERE id=? AND user_id=?',
      [req.params.id, req.user.userId]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Vocabulary not found.' });
    }

    await dbRun(
      `UPDATE vocabularies
       SET word=?,meaning=?,synonyms=?,examples=?,tags=?,notes=?,is_favorite=?,updated_at=CURRENT_TIMESTAMP
       WHERE id=? AND user_id=?`,
      [
        word.trim(),
        meaning.trim(),
        JSON.stringify(synonyms || []),
        JSON.stringify(examples || []),
        JSON.stringify(tags || []),
        notes || '',
        is_favorite ? 1 : 0,
        req.params.id,
        req.user.userId
      ]
    );

    const updated = await dbGet(
      'SELECT * FROM vocabularies WHERE id=?',
      [req.params.id]
    );

    res.json(parseVocabRow(updated));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed.' });
  }
});

// Delete vocabulary
app.delete('/api/vocabularies/:id', authenticateToken, async (req, res) => {

  try {

    await dbRun(
      'DELETE FROM vocabularies WHERE id=? AND user_id=?',
      [req.params.id, req.user.userId]
    );

    res.json({
      message: 'Deleted successfully.'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed.' });
  }

});

// Duplicate vocabulary
app.post('/api/vocabularies/:id/duplicate', authenticateToken, async (req, res) => {

  try {

    const row = await dbGet(
      'SELECT * FROM vocabularies WHERE id=? AND user_id=?',
      [req.params.id, req.user.userId]
    );

    if (!row) {
      return res.status(404).json({ error: 'Vocabulary not found.' });
    }

    const result = await dbRun(
      `INSERT INTO vocabularies
      (user_id,word,meaning,synonyms,examples,tags,notes,is_favorite,created_at,updated_at)
      VALUES(?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
      [
        req.user.userId,
        row.word + ' (Copy)',
        row.meaning,
        row.synonyms,
        row.examples,
        row.tags,
        row.notes,
        row.is_favorite
      ]
    );

    const duplicated = await dbGet(
      'SELECT * FROM vocabularies WHERE id=?',
      [result.id]
    );

    res.status(201).json(parseVocabRow(duplicated));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed.' });
  }

});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Vocab Vault backend server listening on port ${PORT}`);
});
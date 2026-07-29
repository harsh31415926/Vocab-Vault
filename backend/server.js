const express = require('express');
const cors = require('cors');
const { dbAll, dbGet, dbRun } = require('./database');
const { authenticateToken, register, login } = require('./auth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Log API requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Auth Routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// Vocab Helpers
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
    console.error('Failed to parse vocab row JSON fields:', err);
    return {
      ...row,
      is_favorite: row.is_favorite === 1,
      synonyms: [],
      examples: [],
      tags: []
    };
  }
};

// Vocab Routes (All protected by authenticateToken)

// 1. Get all vocabularies with search & filter functionality
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
    params.push(`%"${tag}"%`); // Search inside JSON string array format
  }

  if (search) {
    query += ' AND (word LIKE ? OR meaning LIKE ? OR synonyms LIKE ? OR notes LIKE ? OR tags LIKE ?)';
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam, searchParam, searchParam);
  }

  // Order by created_at DESC (newest first)
  query += ' ORDER BY created_at DESC';

  if (limit) {
    query += ' LIMIT ?';
    params.push(parseInt(limit, 10));
    if (offset) {
      query += ' OFFSET ?';
      params.push(parseInt(offset, 10));
    }
  }

  try {
    const rows = await dbAll(query, params);
    const vocabularies = rows.map(parseVocabRow);
    return res.json(vocabularies);
  } catch (error) {
    console.error('Error fetching vocabularies:', error);
    return res.status(500).json({ error: 'Failed to fetch vocabularies.' });
  }
});

// 2. Get single vocabulary card
app.get('/api/vocabularies/:id', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const vocabId = req.params.id;

  try {
    const row = await dbGet('SELECT * FROM vocabularies WHERE id = ? AND user_id = ?', [vocabId, userId]);
    if (!row) {
      return res.status(404).json({ error: 'Vocabulary card not found.' });
    }
    return res.json(parseVocabRow(row));
  } catch (error) {
    console.error('Error fetching vocabulary details:', error);
    return res.status(500).json({ error: 'Failed to fetch vocabulary details.' });
  }
});

// 3. Create a new vocabulary card
app.post('/api/vocabularies', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { word, meaning, synonyms, examples, tags, notes, is_favorite } = req.body;

  if (!word || !meaning) {
    return res.status(400).json({ error: 'Word and meaning are required fields.' });
  }

  const synonymsStr = JSON.stringify(synonyms || []);
  const examplesStr = JSON.stringify(examples || []);
  const tagsStr = JSON.stringify(tags || []);
  const favVal = is_favorite ? 1 : 0;

  try {
    const result = await dbRun(
      `INSERT INTO vocabularies (user_id, word, meaning, synonyms, examples, tags, notes, is_favorite, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [userId, word.trim(), meaning.trim(), synonymsStr, examplesStr, tagsStr, notes || '', favVal]
    );

    const newVocab = await dbGet('SELECT * FROM vocabularies WHERE id = ?', [result.id]);
    return res.status(201).json(parseVocabRow(newVocab));
  } catch (error) {
    console.error('Error creating vocabulary card:', error);
    return res.status(500).json({ error: 'Failed to create vocabulary card.' });
  }
});

// 4. Update vocabulary card
app.put('/api/vocabularies/:id', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const vocabId = req.params.id;
  const { word, meaning, synonyms, examples, tags, notes, is_favorite } = req.body;

  if (!word || !meaning) {
    return res.status(400).json({ error: 'Word and meaning are required fields.' });
  }

  const synonymsStr = JSON.stringify(synonyms || []);
  const examplesStr = JSON.stringify(examples || []);
  const tagsStr = JSON.stringify(tags || []);
  const favVal = is_favorite ? 1 : 0;

  try {
    // Verify ownership
    const existing = await dbGet('SELECT * FROM vocabularies WHERE id = ? AND user_id = ?', [vocabId, userId]);
    if (!existing) {
      return res.status(404).json({ error: 'Vocabulary card not found or unauthorized.' });
    }

    await dbRun(
      `UPDATE vocabularies
       SET word = ?, meaning = ?, synonyms = ?, examples = ?, tags = ?, notes = ?, is_favorite = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      [word.trim(), meaning.trim(), synonymsStr, examplesStr, tagsStr, notes || '', favVal, vocabId, userId]
    );

    const updated = await dbGet('SELECT * FROM vocabularies WHERE id = ?', [vocabId]);
    return res.json(parseVocabRow(updated));
  } catch (error) {
    console.error('Error updating vocabulary card:', error);
    return res.status(500).json({ error: 'Failed to update vocabulary card.' });
  }
});

// 5. Delete vocabulary card
app.delete('/api/vocabularies/:id', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const vocabId = req.params.id;

  try {
    // Verify ownership
    const existing = await dbGet('SELECT * FROM vocabularies WHERE id = ? AND user_id = ?', [vocabId, userId]);
    if (!existing) {
      return res.status(404).json({ error: 'Vocabulary card not found or unauthorized.' });
    }

    await dbRun('DELETE FROM vocabularies WHERE id = ? AND user_id = ?', [vocabId, userId]);
    return res.json({ message: 'Vocabulary card deleted successfully.', id: parseInt(vocabId, 10) });
  } catch (error) {
    console.error('Error deleting vocabulary card:', error);
    return res.status(500).json({ error: 'Failed to delete vocabulary card.' });
  }
});

// 6. Duplicate vocabulary card
app.post('/api/vocabularies/:id/duplicate', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const vocabId = req.params.id;

  try {
    // Verify ownership and get source card
    const source = await dbGet('SELECT * FROM vocabularies WHERE id = ? AND user_id = ?', [vocabId, userId]);
    if (!source) {
      return res.status(404).json({ error: 'Vocabulary card not found or unauthorized.' });
    }

    const duplicatedWord = `${source.word} (Copy)`;

    const result = await dbRun(
      `INSERT INTO vocabularies (user_id, word, meaning, synonyms, examples, tags, notes, is_favorite, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [userId, duplicatedWord, source.meaning, source.synonyms, source.examples, source.tags, source.notes, source.is_favorite]
    );

    const duplicated = await dbGet('SELECT * FROM vocabularies WHERE id = ?', [result.id]);
    return res.status(201).json(parseVocabRow(duplicated));
  } catch (error) {
    console.error('Error duplicating vocabulary card:', error);
    return res.status(500).json({ error: 'Failed to duplicate vocabulary card.' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Vocab Vault backend server listening on port ${PORT}`);
});

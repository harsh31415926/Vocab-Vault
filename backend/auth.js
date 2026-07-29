const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dbGet, dbRun } = require('./database');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'vocab_vault_secure_token_secret_key_2026';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    req.user = decoded;
    next();
  });
};

// Register controller
const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Check if user exists
    const existingUser = await dbGet('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await dbRun(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [normalizedEmail, hashedPassword]
    );

    // Generate token
    const token = jwt.sign(
      { userId: result.id, email: normalizedEmail },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: { id: result.id, email: normalizedEmail }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'An error occurred during registration.' });
  }
};

// Login controller
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Find user
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: normalizedEmail },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      message: 'Logged in successfully.',
      token,
      user: { id: user.id, email: normalizedEmail }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'An error occurred during login.' });
  }
};

module.exports = {
  authenticateToken,
  register,
  login
};

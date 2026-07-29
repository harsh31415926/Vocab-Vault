# VocabVault — Personal Vocabulary Vault

A premium, minimalistic, and secure personal vocabulary notebook web application designed for builders, readers, and language enthusiasts to master English vocabulary over many years. Built with **React (Vite)** on the frontend, and **Express & SQLite** on the backend.

Inspired by the design aesthetics of **Notion, Obsidian, and Apple Notes**, VocabVault utilizes a focused, professional dark-theme layout with a single Slate Blue accent, maximizing whitespace and typography hierarchy while ensuring fast, responsive, and private offline-first interactions.

---

## Key Features

1. **Private User Accounts**: Full Sign Up, Sign In, and Logout flows. Every user's database entries are isolated so that no user can access another's lexicon.
2. **Effortless Word Recording**: Click the central "+" button to instantly add a blank card directly into the dashboard grid and type the details. No distracting popups.
3. **Multi-dimensional Attributes**: For each word, record its spelling, clear meaning, notes preview, synonyms list, custom tags, and custom example sentences.
4. **Detail Edit Modal**: Click a card to slide open a beautiful focused workspace to add synonyms, tag tags, write recall notes, and edit sentences.
5. **Masonry Layout**: Cards arrange themselves responsively dynamically across screen widths (3-5 columns on desktop, 2 on tablet, 1 on mobile).
6. **Instant Multi-field Search**: Instantly query your vault by word spelling, meanings, synonyms, tags, or personal study notes with zero latency.
7. **Favorites List**: Curate cards into a dedicated star section.
8. **Anki-style Revision Mode**: Test your vocabulary memory by shuffling your cards, hiding definitions, and displaying them card-by-card in active recall mode.
9. **Working CSV Exporter**: Download your entire collection as a standard spreadsheet at any time for study, backups, or migration.

---

## Folder Structure

```
Vocab/
├── package.json               # Root monorepo configuration (concurrent scripts)
├── README.md                  # System setup & architecture overview
├── backend/                   # Node.js API Service
│   ├── .env                   # Server configuration variables
│   ├── vocab.db               # SQLite database file (created on boot)
│   ├── database.js            # SQLite tables schema & promise wrappers
│   ├── auth.js                # JWT creation, Bcrypt password hashing, & auth middleware
│   ├── server.js              # Express routing & controller routes
│   └── package.json           # Backend dependency configuration
└── frontend/                  # React Vite Client
    ├── index.html             # Main index shell (custom description & fonts)
    ├── vite.config.js         # Port configuration & reverse-proxy mapping
    ├── package.json           # Frontend dependency configuration
    └── src/
        ├── main.jsx           # React app mount
        ├── App.jsx            # Core application state & CRUD event routing
        ├── index.css          # Design system stylesheet (Obsidian color palette)
        ├── services/
        │   └── api.js         # API integration client (fetch wrapper with headers)
        └── components/
            ├── AuthScreen.jsx # Centered login & sign up card
            ├── Sidebar.jsx    # Left navigation containing dynamic tag lists
            ├── Navbar.jsx     # Header banner, search bar, and floating "+"
            ├── VocabCard.jsx  # Card layout with draft and edit mode
            ├── VocabModal.jsx # Backdrop edit modal for detailed writing
            ├── RevisionMode.jsx # Flashcard learning view
            ├── SettingsView.jsx # Account info, CSV backup exporter, and stubs
            └── AboutView.jsx  # System details & app principles
```

---

## System Requirements

- **Node.js**: `v18.0.0` or higher (verified compatible with `v24.0.0`)
- **npm**: `v9.0.0` or higher

---

## Quick Start Installation

### 1. Clone or Extract Project
Make sure you are in the workspace root directory:
```bash
/Users/harshsharma/Desktop/Orator/Vocab
```

### 2. Install All Dependencies
Install the package libraries for the monorepo root, frontend client, and backend server with a single script:
```bash
npm run install-all
```
This is equivalent to running `npm install` inside the root, `./backend`, and `./frontend` folders.

### 3. Run in Development Mode
Boot the API server (on port 5001) and Vite client (on port 3000) concurrently:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## Production Deployment Guide

To deploy the application to a production server (VPS, Heroku, Render, AWS, etc.):

### 1. Build the Frontend
Compile static HTML/JS/CSS assets:
```bash
npm run build --prefix frontend
```
The compiled files are generated in `frontend/dist/`.

### 2. Configure Backend static hosting (Optional)
If you wish to host both services from a single port, configure your backend `server.js` to serve the static frontend folder:
```javascript
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});
```

### 3. Setup Environment Variables
Set the following system environment variables on your server:
- `PORT`: Port to bind the server to (e.g. `5001` or `80`).
- `JWT_SECRET`: A long, random cryptographic string to secure user sessions.
- `DATABASE_FILE`: Relative path to store the SQLite database (e.g. `/var/data/vocab.db`).
- `NODE_ENV`: Set to `production`.

### 4. Start the Application
Run:
```bash
npm run start
```

---

## Database Design

SQLite is used as the relational storage engine. Tables are designed with indexing and foreign key constraints:

### `users` Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### `vocabularies` Table
```sql
CREATE TABLE vocabularies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  word TEXT NOT NULL,
  meaning TEXT NOT NULL,
  synonyms TEXT, -- Stored as a serialized JSON string array, e.g. '["insight", "wisdom"]'
  examples TEXT, -- Stored as a serialized JSON string array
  tags TEXT,     -- Stored as a serialized JSON string array
  notes TEXT,    -- User study text
  is_favorite INTEGER DEFAULT 0, -- 0 for false, 1 for true
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
```

---

## Architecture Readiness for Future Features

The codebase has been designed to make these future integrations highly modular:
- **Daily Word Reminder**: Add a column `last_reviewed_at` to the `vocabularies` schema. Create a Cron utility on the server matching user settings to trigger reminder notifications.
- **Spaced Repetition (Anki/SuperMemo)**: Store learning statistics (`difficulty`, `interval`, `repetition_count`, `easiness_factor`) on the `vocabularies` rows to calculate scheduling intervals.
- **AI Integration (Quiz/Examples)**: The system handles raw inputs without parsing third-party endpoints. To add AI generators, implement a proxy controller under `/api/ai` that queries the Gemini API using your keys and appends the result to the card.

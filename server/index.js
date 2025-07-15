const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const dbPath = path.join(__dirname, '../listings.db');
const db = new sqlite3.Database(path.join(__dirname, '../listings.db'), (err) => {
  if (err) {
    console.error('❌ Failed to connect to DB:', err.message);
  } else {
    console.log('✅ Connected to SQLite DB');
  }
});

// Ensure both tables exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS seen (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      url TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      url TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});


app.use(cors({
  origin: 'https://analyzerrrrr-frontend.onrender.com'
}));
app.use(express.json());

app.get('/api/search', (req, res) => {
  const q = req.query.q || '';
  const query = `%${q.toLowerCase()}%`;

  console.log(`🔍 Search triggered: ${q}`);

  // 🔎 Search both `seen` and `listings`
  const sql = `
    SELECT * FROM seen WHERE LOWER(title) LIKE ? OR LOWER(url) LIKE ?
    UNION
    SELECT * FROM listings WHERE LOWER(title) LIKE ?
    ORDER BY timestamp DESC
  `;

  db.all(sql, [query, query, query], (err, rows) => {
    if (err) {
      console.error("❌ SQL error:", err.message);
      return res.status(500).json({ error: "Database query failed." });
    }

    const cleaned = rows.map(row => {
      const yearMatch = row.title.match(/\b(19|20)\d{2}\b/);
      const year = yearMatch ? parseInt(yearMatch[0]) : null;

      const cleanTitle = row.title.replace(/^\(\d+\)\sMarketplace\s-\s(.+?)\s\|\sFacebook$/, '$1');

      return {
        ...row,
        title: cleanTitle,
        year
      };
    });

    res.json(cleaned);
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database(path.join(__dirname, '../listings.db'));

app.use(cors({
  origin: 'https://analyzerrrrr-frontend.onrender.com'
}));

app.use(express.json());

app.get('/api/search', async (req, res) => {
  try {
    console.log(`🔍 API search received: ${req.query.q}`);

    const db = new sqlite3.Database('./listings.db', sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        console.error("❌ DB error:", err.message);
        return res.status(500).json({ error: "DB connection failed" });
      }
    });

    const sql = `SELECT * FROM seen WHERE title LIKE ? OR url LIKE ? ORDER BY timestamp DESC`;

    db.all(sql, [`%${req.query.q}%`, `%${req.query.q}%`], (err, rows) => {
      if (err) {
        console.error("❌ SQL error:", err.message);
        return res.status(500).json({ error: "SQL error" });
      }
      res.json(rows);
    });
  } catch (err) {
    console.error("❌ Unexpected error:", err.message);
    res.status(500).json({ error: "Server error" });
  }


  const q = req.query.q || '';
  const query = `%${q.toLowerCase()}%`;

  db.all(`SELECT * FROM listings WHERE LOWER(title) LIKE ?`, [query], (err, rows) => {
    if (err) return res.status(500).send(err.message);

    const cleaned = rows.map(row => {
      // Extract year
      const yearMatch = row.title.match(/\b(19|20)\d{2}\b/);
      const year = yearMatch ? parseInt(yearMatch[0]) : null;


      const all = rows.map(row => {
  const match = row.title.match(/\b(19|20)\d{2}\b/); // extracts year like 2015
  return {
    ...row,
    year: match ? parseInt(match[0]) : null
  };
});

      // Clean title
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

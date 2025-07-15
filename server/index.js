const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./listings.db');

app.use(cors({
  origin: 'https://analyzerrrrr-frontend.onrender.com',
}));

app.use(express.json());

// ✅ Define the /api/search route
app.get('/api/search', (req, res) => {
  const q = req.query.q || '';
  const query = `%${q.toLowerCase()}%`;

  console.log("🔍 Search triggered:", q);

  const sql = `SELECT * FROM listings WHERE LOWER(title) LIKE ?`;

  db.all(sql, [query], (err, rows) => {
    if (err) {
      console.error("❌ SQL error:", err.message);
      return res.status(500).json({ error: "SQL error" });
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

// ✅ Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

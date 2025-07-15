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

app.get('/api/search', (req, res) => {
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

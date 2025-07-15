import { useState } from 'react';
import axios from 'axios';
import PriceVsKmChart from './components/PriceVsKmChart';
import AveragePriceByYearChart from './components/AveragePriceByYearChart';
import DynamicPriceChart from './components/DynamicPriceChart';
import { motion } from 'framer-motion';
function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [chartMode, setChartMode] = useState('kms');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async () => {
    console.log('Search triggered:', query);
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await axios.get(`https://keekos-analyzer.onrender.com/api/search?q=${query}`);
      setResults(res.data);
      if (res.data.length === 0) setError('No results found.');
    } catch (err) {
      console.error('Search error:', err.message);
      setError('Failed to load results. Please try again later.');
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>📊 KEEKOS ANALYZER</h1>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="e.g. honda civic"
        style={{ padding: '8px', fontSize: '16px', width: '300px', marginRight: '10px' }}
      />
      <button onClick={search} style={{ padding: '8px 16px', fontSize: '16px' }}>Search</button>

      <div style={{ marginTop: '30px' }}>
        {loading && <p>🔄 Searching...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {results.length > 0 && (
          <>
            <h2>{results.length} results found</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {results.map((r, i) => (
  <motion.li
    key={i}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: i * 0.05 }}
    style={{
      display: 'flex',
      marginBottom: '20px',
      borderBottom: '1px solid #ccc',
      paddingBottom: '10px'
    }}
  >
    {r.thumb && (
      <img
        src={r.thumb}
        alt="thumb"
        style={{ width: 120, height: 90, objectFit: 'cover', marginRight: 15 }}
      />
    )}
    <div style={{ lineHeight: 1.6 }}>
      <div><strong>Title:</strong> {r.title}</div>
      <div><strong>Price:</strong> ${r.price.toLocaleString()}</div>
      <div><strong>Kilometers:</strong> {r.kms.toLocaleString()} km</div>
      <div><strong>Date Listed:</strong> {new Date(r.timestamp * 1000).toLocaleString()}</div>
      <div><strong>Location:</strong> {r.location}</div>
    </div>
  </motion.li>
))}
            </ul>
            <div style={{ marginTop: 20 }}>
              <label>Chart Mode:</label>
              <select value={chartMode} onChange={e => setChartMode(e.target.value)} style={{ marginLeft: 10 }}>
                <option value="kms">Price vs. KM</option>
                <option value="year">Price vs. Year</option>
              </select>
            </div>

            <DynamicPriceChart data={results} mode={chartMode} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;

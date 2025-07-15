import { useState } from 'react';
import axios from 'axios';
import DynamicPriceChart from './components/DynamicPriceChart';
import { motion } from 'framer-motion';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [chartMode, setChartMode] = useState('kms');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async () => {
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
    <div style={{ display: 'flex', backgroundColor: '#1e1e1e', color: '#fff', minHeight: '100vh' }}>
      {/* Left column: main content */}
      <div style={{ flex: 1, padding: '20px 40px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h1 style={{ fontSize: '36px' }}>📊 KEEKOS ANALYZER</h1>
          <div style={{ marginTop: 10 }}>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g. honda civic"
              style={{
                padding: '10px',
                fontSize: '16px',
                width: '300px',
                marginRight: '10px',
                borderRadius: 4,
                border: 'none'
              }}
            />
            <button
              onClick={search}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                borderRadius: 4,
                border: '1px solid #fff',
                background: 'transparent',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Results */}
        {loading && <div style={{ textAlign: 'center' }}>🔄 Loading...</div>}
        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}

        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>{results.length} results found</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {results.map((r, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  style={{
                    display: 'flex',
                    marginBottom: '20px',
                    borderBottom: '1px solid #444',
                    paddingBottom: '10px'
                  }}
                >
                  {r.thumb && (
                    <img
                      src={r.thumb}
                      alt="thumb"
                      style={{
                        width: 120,
                        height: 90,
                        objectFit: 'cover',
                        marginRight: 15,
                        borderRadius: 6
                      }}
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
          </motion.div>
        )}
      </div>

      {/* Right column: sticky chart */}
      <div
        style={{
          width: '400px',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          backgroundColor: '#141414',
          padding: '20px',
          borderLeft: '1px solid #333',
          flexShrink: 0
        }}
      >
        {results.length > 0 && (
          <>
            <div style={{ marginBottom: 10 }}>
              <label>Chart Mode:</label>
              <select
                value={chartMode}
                onChange={e => setChartMode(e.target.value)}
                style={{ marginLeft: 10, padding: '4px', borderRadius: 4 }}
              >
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

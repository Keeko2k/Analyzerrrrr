import { useState } from 'react';
import axios from 'axios';
import PriceVsKmChart from './components/PriceVsKmChart';
import AveragePriceByYearChart from './components/AveragePriceByYearChart';
import DynamicPriceChart from './components/DynamicPriceChart';
import { motion } from 'framer-motion';
export default App;



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
  <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#1e1e1e', color: '#fff' }}>
    
    {/* Main content column */}
    <div style={{ flex: 1, padding: 20, maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>📊 KEEKOS ANALYZER</h1>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="e.g. honda civic"
          style={{ padding: '8px', fontSize: '16px', width: '300px', marginRight: '10px' }}
        />
        <button onClick={search} style={{ padding: '8px 16px', fontSize: '16px' }}>Search</button>
      </div>

      {/* Listing Results */}
      <div style={{ marginTop: '30px' }}>
        {results.length > 0 && (
          <>
            <h2>{results.length} results found</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {results.map((r, i) => (
                <li
                  key={i}
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
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>

    {/* Sticky chart column */}
    <div style={{
      width: '400px',
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
      backgroundColor: '#141414',
      padding: '20px',
      borderLeft: '1px solid #333'
    }}>
      {results.length > 0 && (
        <>
          <div>
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
)}
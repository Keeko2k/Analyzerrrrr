import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function AveragePriceByYearChart({ data }) {
  const yearMap = {};

  data.forEach(item => {
    if (!item.year || item.price <= 0) return;
    if (!yearMap[item.year]) yearMap[item.year] = [];
    yearMap[item.year].push(item.price);
  });

  const chartData = Object.entries(yearMap).map(([year, prices]) => ({
    year,
    averagePrice: Math.round(prices.reduce((a, b) => a + b) / prices.length)
  }));

  return (
    <div style={{ height: 400, marginTop: 40 }}>
      <h3>📊 Average Price by Model Year</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="averagePrice" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AveragePriceByYearChart;

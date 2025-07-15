import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function PriceVsKmChart({ data }) {
  const chartData = data
    .filter(item => item.price > 0 && item.kms > 0)
    .map(item => ({
      price: item.price,
      kms: item.kms,
      label: item.title
    }));

  return (
    <div style={{ height: 400, marginTop: 40 }}>
      <h3>📈 Price vs. Kilometers</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart>
          <CartesianGrid />
          <XAxis type="number" dataKey="kms" name="Kilometers" unit=" km" />
          <YAxis type="number" dataKey="price" name="Price" unit=" $" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Listings" data={chartData} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PriceVsKmChart;

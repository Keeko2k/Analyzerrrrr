import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

function DynamicPriceChart({ data, mode }) {
  const chartData = data
    .filter(item => item.price > 0 && item.kms > 0 && (mode === 'year' ? item.year : true))
    .map(item => ({
      price: item.price,
      x: mode === 'kms' ? item.kms : item.year,
      label: item.title
    }))
    .filter(item => item.x); // remove nulls

  const xLabel = mode === 'kms' ? 'Kilometers' : 'Model Year';

  return (
    <div style={{ height: 400, marginTop: 40 }}>
      <h3>📈 Price vs. {xLabel}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" name={xLabel} />
          <YAxis dataKey="price" name="Price" />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DynamicPriceChart;

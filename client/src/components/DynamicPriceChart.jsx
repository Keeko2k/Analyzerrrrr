import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  ZAxis,
  Legend,
  Line
} from 'recharts';

const chartHeight = window.innerWidth < 600 ? 300 : 400;

const DynamicPriceChart = ({ data, mode }) => {
  if (!data || data.length === 0) return null;

  // Helper: Group data into KM buckets
  const groupByKmBucket = (data) => {
    const buckets = {};
    const bucketSize = 50000;

    data.forEach(item => {
      const bucket = Math.floor(item.kms / bucketSize) * bucketSize;
      if (!buckets[bucket]) {
        buckets[bucket] = { totalPrice: 0, count: 0 };
      }
      buckets[bucket].totalPrice += item.price;
      buckets[bucket].count++;
    });

    return Object.entries(buckets).map(([bucketStart, { totalPrice, count }]) => ({
      bucketKm: +bucketStart + bucketSize / 2,
      avgPrice: Math.round(totalPrice / count),
      count
    }));
  };

  // ------- MODE: Price vs. Kilometers (Grouped Scatter Plot) -------
  if (mode === 'kms') {
    const cleanedData = data.filter(d => d.kms && d.price && !isNaN(d.kms) && !isNaN(d.price));
    const groupedData = groupByKmBucket(cleanedData);

    return (
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid stroke="#444" />
            <XAxis
              type="number"
              dataKey="bucketKm"
              name="Kilometers"
              domain={[0, 'auto']}
              tickFormatter={(v) => `${v.toLocaleString()} km`}
              tick={{ fill: '#ccc', fontSize: window.innerWidth < 600 ? 10 : 12 }}
            />
            <YAxis
              type="number"
              dataKey="avgPrice"
              name="Price"
              domain={[0, 7000]}
              tickFormatter={(v) => `$${v}`}
              interval={0}
              tick={{ fill: '#ccc', fontSize: window.innerWidth < 600 ? 10 : 12 }}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'avgPrice') return [`$${value}`, 'Avg Price'];
                if (name === 'bucketKm') return [`${value.toLocaleString()} km`, 'KM Range'];
                return value;
              }}
              labelFormatter={() => ''}
            />
            <Scatter name="Listings" data={groupedData} fill="#a78bfa">
              {window.innerWidth >= 600 && (
                <LabelList dataKey="count" position="top" formatter={(v) => `${v}x`} />
              )}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // ------- MODE: Price vs. Year (Bubble Chart with Avg + Count + Trendline) -------
  if (mode === 'year') {
    const grouped = {};
    data.forEach(item => {
      const year = parseInt(item.year);
      if (!year || isNaN(year)) return;
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(item.price);
    });

    const yearData = Object.entries(grouped).map(([year, prices]) => {
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      return {
        year: parseInt(year),
        avgPrice,
        count: prices.length,
        size: 20 + prices.length * 3
      };
    }).sort((a, b) => a.year - b.year);

    return (
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis
              dataKey="year"
              type="number"
              name="Year"
              domain={['auto', 'auto']}
              tick={{ fill: '#fff', fontSize: window.innerWidth < 600 ? 10 : 12 }}
            />
            <YAxis
              type="number"
              dataKey="avgPrice"
              name="Average Price"
              unit="$"
              domain={[0, 7000]}
              tick={{ fill: '#ccc', fontSize: window.innerWidth < 600 ? 10 : 12 }}
              axisLine={{ stroke: '#666' }}
              tickLine={{ stroke: '#666' }}
            />
            <ZAxis dataKey="size" range={window.innerWidth < 600 ? [50, 200] : [100, 400]} name="Listing Count" />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'avgPrice') return [`$${value.toLocaleString()}`, 'Avg Price'];
                if (name === 'bucketKm') return [`${value.toLocaleString()} km`, 'KM Range'];
                if (name === 'count') return [`${value}`, 'Listings'];
                return [value, name];
              }}
              labelFormatter={(label) => `Year: ${label}`}
            />
            <Legend verticalAlign="top" height={36}/>
            <Scatter name="Average Price" data={yearData} fill="#a78bfa">
              {window.innerWidth >= 600 && (
                <LabelList
                  dataKey="count"
                  position="top"
                  formatter={val => `${val}x`}
                  fill="#fff"
                />
              )}
            </Scatter>
            <Line
              type="monotone"
              dataKey="avgPrice"
              data={yearData}
              stroke="#a78bfa"
              dot={false}
              name=""
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
};

export default DynamicPriceChart;

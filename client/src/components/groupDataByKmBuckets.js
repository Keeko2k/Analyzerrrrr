// groupDataByKmBuckets.js
export const groupByKmBucket = (data) => {
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
    bucketKm: +bucketStart + bucketSize / 2, // midpoint
    avgPrice: Math.round(totalPrice / count),
    count
  }));
};

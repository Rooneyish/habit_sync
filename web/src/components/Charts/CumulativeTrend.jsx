function CumulativeTrend({ data, unit }) {
  if (!data?.length) return <div style={{color: '#444'}}>No growth data...</div>;

  const height = 250;
  const width = 700;
  const padding = 40;
  
  const rawMax = Math.max(...data.map(d => d.cumulative));
  const maxValue = rawMax === 0 ? 10 : rawMax * 1.2;

  const xScale = (i) => data.length <= 1 ? width / 2 : (i / (data.length - 1)) * (width - 2 * padding) + padding;
  const yScale = (v) => height - padding - (v / maxValue) * (height - 2 * padding);

  const points = data.map((d, i) => ({ x: xScale(i), y: yScale(d.cumulative) }));
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  
  // Closing the path to create a fillable area
  const areaPath = `${linePath} L ${points[points.length-1].x} ${height-padding} L ${points[0].x} ${height-padding} Z`;

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid */}
        {[0, 0.5, 1].map(v => (
          <line key={v} x1={padding} y1={yScale(maxValue * v)} x2={width-padding} y2={yScale(maxValue * v)} stroke="#1a1a1a" strokeDasharray="5,5" />
        ))}

        <path d={areaPath} fill="url(#chartGradient)" />
        <path d={linePath} fill="none" stroke="#fff" strokeWidth="2" />

        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#000" strokeWidth="2" />
        ))}

        <text x={padding} y={height - 10} fill="#444" fontSize="10">{data[0].date}</text>
        <text x={width - padding} y={height - 10} fill="#444" fontSize="10" textAnchor="end">{data[data.length-1].date}</text>
      </svg>
    </div>
  );
}

export default CumulativeTrend;
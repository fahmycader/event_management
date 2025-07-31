export function ChartContainer({ children, config, className = "" }) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        {/* You can use config for legends later */}
        {children}
      </div>
    );
  }
  
  export function ChartTooltip({ active, payload, label, content }) {
    if (!active || !payload || payload.length === 0) return null;
    return content ? content({ active, payload, label }) : null;
  }
  
  export function ChartTooltipContent({ payload, label }) {
    return (
      <div className="rounded-md bg-white p-2 shadow border text-xs">
        {label && <div className="font-semibold mb-1">{label}</div>}
        {payload?.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-2">
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
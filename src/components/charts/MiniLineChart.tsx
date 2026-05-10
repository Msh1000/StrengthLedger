import { motion } from 'framer-motion'

interface MiniLineChartProps {
  points: number[]
}

export function MiniLineChart({ points }: MiniLineChartProps) {
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = Math.max(1, max - min)
  const coords = points
    .map((point, index) => {
      const x = (index / Math.max(1, points.length - 1)) * 100
      const y = 80 - ((point - min) / range) * 60
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg className="mini-chart" viewBox="0 0 100 90" role="img" aria-label="Progress line chart">
      <defs>
        <linearGradient id="chartLine" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-2)" />
        </linearGradient>
      </defs>
      {[20, 40, 60, 80].map((y) => (
        <line key={y} x1="0" x2="100" y1={y} y2={y} className="chart-grid" />
      ))}
      <motion.polyline
        points={coords}
        fill="none"
        stroke="url(#chartLine)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6 }}
      />
      {points.map((point, index) => {
        const x = (index / Math.max(1, points.length - 1)) * 100
        const y = 80 - ((point - min) / range) * 60
        return <circle key={`${point}-${index}`} cx={x} cy={y} r="2.4" className="chart-dot" />
      })}
    </svg>
  )
}

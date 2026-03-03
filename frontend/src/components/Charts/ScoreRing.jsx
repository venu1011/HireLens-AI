/**
 * Premium SVG Score Ring component with animated gradient arc
 */
export default function ScoreRing({ score, size = 120, strokeWidth = 10 }) {
  const radius = (size / 2) - strokeWidth - 4
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const getColor = (s) => {
    if (s >= 75) return { main: '#22c55e', glow: 'rgba(34,197,94,0.4)', gradient: ['#22c55e', '#4ade80'] }
    if (s >= 50) return { main: '#eab308', glow: 'rgba(234,179,8,0.4)', gradient: ['#eab308', '#fbbf24'] }
    if (s >= 25) return { main: '#f97316', glow: 'rgba(249,115,22,0.4)', gradient: ['#f97316', '#fb923c'] }
    return { main: '#ef4444', glow: 'rgba(239,68,68,0.4)', gradient: ['#ef4444', '#f87171'] }
  }

  const getLabel = (s) => {
    if (s >= 75) return 'Excellent'
    if (s >= 50) return 'Good'
    if (s >= 25) return 'Fair'
    return 'Needs Work'
  }

  const { main, glow, gradient } = getColor(score)
  const gradientId = `ring-grad-${size}-${score}`

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradient[0]} />
            <stop offset="100%" stopColor={gradient[1]} />
          </linearGradient>
        </defs>
        {/* Background track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={strokeWidth}
        />
        {/* Subtle inner glow track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={main} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: `drop-shadow(0 0 6px ${glow})`
          }}
          opacity="0.3"
        />
        {/* Main progress arc */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={`url(#${gradientId})`} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold tracking-tight" style={{ color: main, fontSize: size * 0.24 }}>{score}</span>
        <span className="text-slate-500 font-medium" style={{ fontSize: Math.max(9, size * 0.085) }}>{getLabel(score)}</span>
      </div>
    </div>
  )
}

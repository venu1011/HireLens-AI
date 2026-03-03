/**
 * SVG Score Ring component – no Chart.js dependency needed
 */
export default function ScoreRing({ score, size = 120 }) {
  const radius = (size / 2) - 12
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const getColor = (s) => {
    if (s >= 75) return '#22c55e'
    if (s >= 50) return '#eab308'
    if (s >= 25) return '#f97316'
    return '#ef4444'
  }

  const getLabel = (s) => {
    if (s >= 75) return 'Excellent'
    if (s >= 50) return 'Good'
    if (s >= 25) return 'Fair'
    return 'Poor'
  }

  const color = getColor(score)

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth="10"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center" style={{ marginTop: -size / 2 - 20 }}>
        <span className="text-2xl font-bold text-white" style={{ color }}>{score}</span>
        <span className="text-[10px] text-slate-500 font-medium">{getLabel(score)}</span>
      </div>
      {/* Overlay text */}
      <div className="relative" style={{ marginTop: -(size + 4) }}>
        <div className="flex flex-col items-center justify-center" style={{ height: size }}>
          <span className="text-2xl font-bold" style={{ color }}>{score}</span>
          <span className="text-xs text-slate-500">{getLabel(score)}</span>
        </div>
      </div>
    </div>
  )
}

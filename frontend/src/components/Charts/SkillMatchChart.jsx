import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function SkillMatchChart({ matched, missing, extra }) {
  const data = {
    labels: ['Matched', 'Missing', ...(extra > 0 ? ['Extra'] : [])],
    datasets: [{
      data: [matched, missing, ...(extra > 0 ? [extra] : [])],
      backgroundColor: [
        'rgba(34,197,94,0.75)',
        'rgba(239,68,68,0.75)',
        ...(extra > 0 ? ['rgba(59,130,246,0.6)'] : [])
      ],
      borderColor: ['transparent', 'transparent', ...(extra > 0 ? ['transparent'] : [])],
      borderWidth: 0,
      hoverOffset: 6,
      borderRadius: 4,
      spacing: 3,
    }]
  }

  const options = {
    responsive: true,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(3,7,18,0.95)',
        titleColor: '#94a3b8',
        bodyColor: '#fff',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        bodyFont: { weight: '500' }
      }
    }
  }

  if (matched + missing === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <span className="text-slate-600 text-lg">-</span>
        </div>
        <p className="text-slate-600 text-sm">No skill data</p>
      </div>
    )
  }

  const total = matched + missing
  const matchPct = total > 0 ? Math.round((matched / total) * 100) : 0

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative" style={{ width: 200, height: 200 }}>
        <Doughnut data={data} options={options} />
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{matchPct}%</span>
          <span className="text-xs text-slate-500 font-medium">skill match</span>
        </div>
      </div>
      {/* Legend chips */}
      <div className="flex items-center gap-4">
        <LegendItem color="#22c55e" label="Matched" count={matched} />
        <LegendItem color="#ef4444" label="Missing" count={missing} />
        {extra > 0 && <LegendItem color="#3b82f6" label="Extra" count={extra} />}
      </div>
    </div>
  )
}

function LegendItem({ color, label, count }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: `${color}08` }}>
      <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}60` }} />
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-sm font-bold text-white">{count}</span>
    </div>
  )
}

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function SkillMatchChart({ matched, missing, extra }) {
  const total = matched + missing + (extra > 0 ? 1 : 0)

  const data = {
    labels: ['Matched Skills', 'Missing Skills', ...(extra > 0 ? ['Extra Skills'] : [])],
    datasets: [{
      data: [matched, missing, ...(extra > 0 ? [Math.min(extra, missing)] : [])],
      backgroundColor: ['rgba(34,197,94,0.8)', 'rgba(239,68,68,0.8)', 'rgba(59,130,246,0.5)'],
      borderColor: ['#22c55e', '#ef4444', '#3b82f6'],
      borderWidth: 2,
      hoverOffset: 4
    }]
  }

  const options = {
    responsive: true,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          padding: 16,
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#94a3b8',
        bodyColor: '#fff',
        borderColor: '#334155',
        borderWidth: 1
      }
    }
  }

  if (matched + missing === 0) {
    return <div className="text-center text-slate-500 py-8">No skill data available</div>
  }

  return (
    <div className="flex flex-col items-center">
      <div style={{ maxWidth: 240, width: '100%' }}>
        <Doughnut data={data} options={options} />
      </div>
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{matched}</div>
          <div className="text-slate-500 text-xs">Matched</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">{missing}</div>
          <div className="text-slate-500 text-xs">Missing</div>
        </div>
        {extra > 0 && (
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{extra}</div>
            <div className="text-slate-500 text-xs">Extra</div>
          </div>
        )}
      </div>
    </div>
  )
}

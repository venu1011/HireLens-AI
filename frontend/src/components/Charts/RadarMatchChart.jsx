import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'
import { Radar } from 'react-chartjs-2'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

export default function RadarMatchChart({ atsBreakdown }) {
  if (!atsBreakdown) return null

  const labels = ['Keyword Match', 'Section Completeness', 'Action Verbs', 'Metrics', 'Formatting']
  const maxes = [40, 20, 15, 15, 10]
  const values = [
    atsBreakdown.keywordMatch,
    atsBreakdown.sectionCompleteness,
    atsBreakdown.actionVerbs,
    atsBreakdown.measurableMetrics,
    atsBreakdown.formattingRules
  ]
  const normalizedValues = values.map((v, i) => Math.round((v / maxes[i]) * 100))

  const data = {
    labels,
    datasets: [
      {
        label: 'Your Resume',
        data: normalizedValues,
        backgroundColor: 'rgba(59,130,246,0.15)',
        borderColor: '#3b82f6',
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#3b82f6',
        borderWidth: 2
      },
      {
        label: 'Ideal Score',
        data: [100, 100, 100, 100, 100],
        backgroundColor: 'rgba(139,92,246,0.05)',
        borderColor: 'rgba(139,92,246,0.3)',
        pointBackgroundColor: 'rgba(139,92,246,0.5)',
        borderDash: [4, 4],
        borderWidth: 1.5
      }
    ]
  }

  const options = {
    responsive: true,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: { display: false },
        grid: { color: '#1e293b' },
        pointLabels: { color: '#94a3b8', font: { size: 11 } },
        angleLines: { color: '#1e293b' }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8', padding: 16, font: { size: 11 } }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#94a3b8',
        bodyColor: '#fff',
        borderColor: '#334155',
        borderWidth: 1,
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}%`
        }
      }
    }
  }

  return <Radar data={data} options={options} />
}

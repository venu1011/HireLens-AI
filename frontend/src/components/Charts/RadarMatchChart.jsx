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
        backgroundColor: 'rgba(59,130,246,0.08)',
        borderColor: 'rgba(59,130,246,0.6)',
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#030712',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 1.5
      },
      {
        label: 'Ideal Score',
        data: [100, 100, 100, 100, 100],
        backgroundColor: 'rgba(124,58,237,0.03)',
        borderColor: 'rgba(124,58,237,0.15)',
        pointBackgroundColor: 'rgba(124,58,237,0.3)',
        pointRadius: 2,
        borderDash: [3, 3],
        borderWidth: 1
      }
    ]
  }

  const options = {
    responsive: true,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: { display: false, stepSize: 25 },
        grid: { color: 'rgba(255,255,255,0.04)' },
        pointLabels: { color: 'rgba(255,255,255,0.35)', font: { size: 10, weight: 500 } },
        angleLines: { color: 'rgba(255,255,255,0.04)' }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: 'rgba(255,255,255,0.4)', padding: 14, font: { size: 10 }, usePointStyle: true, pointStyleWidth: 8 }
      },
      tooltip: {
        backgroundColor: 'rgba(3,7,18,0.95)',
        titleColor: '#64748b',
        bodyColor: '#fff',
        borderColor: 'rgba(59,130,246,0.2)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        bodyFont: { size: 11 },
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}%`
        }
      }
    }
  }

  return <Radar data={data} options={options} />
}

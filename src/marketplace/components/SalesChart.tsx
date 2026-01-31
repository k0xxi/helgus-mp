import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { MonthlyData } from '@/marketplace/hooks/useDashboardStats'

interface SalesChartProps {
  data: MonthlyData[]
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Verkäufe pro Monat</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="stroke-slate-200 dark:stroke-slate-700"
          />
          <XAxis
            dataKey="month"
            stroke="currentColor"
            className="text-xs text-slate-600 dark:text-slate-400"
          />
          <YAxis
            stroke="currentColor"
            className="text-xs text-slate-600 dark:text-slate-400"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
            }}
            formatter={(value?: number) => value ? `${value} Verkäufe` : ''}
          />
          <Bar
            dataKey="sales"
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
            className="fill-blue-500"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

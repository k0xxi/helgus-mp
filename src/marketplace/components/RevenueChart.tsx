import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { MonthlyData } from '@/marketplace/hooks/useDashboardStats'

interface RevenueChartProps {
  data: MonthlyData[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Erlös pro Monat</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
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
            tickFormatter={(value) => `€${value.toLocaleString('de-DE', { maximumFractionDigits: 0 })}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
            }}
            formatter={(value?: number) => value ? `€${value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#dc2626"
            strokeWidth={2}
            dot={{ fill: '#dc2626', r: 4 }}
            activeDot={{ r: 6 }}
            className="stroke-red-600"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

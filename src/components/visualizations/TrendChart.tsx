"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

interface TrendChartProps {
  data: { date: string; value: number }[]
  color: string
}

export function TrendChart({ data, color }: TrendChartProps) {
  const colorMap: Record<string, string> = {
    "text-red-500": "#ef4444",
    "text-orange-500": "#f97316",
    "text-blue-500": "#3b82f6",
    "text-cyan-500": "#06b6d4",
    "text-green-500": "#10b981",
    "text-purple-500": "#a855f7"
  }

  const chartColor = colorMap[color] || "#3b82f6"

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
            <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
        <XAxis 
          dataKey="date" 
          stroke="#9ca3af"
          tick={{ fill: "#9ca3af", fontSize: 12 }}
          tickFormatter={(value) => {
            const date = new Date(value)
            return `${date.getMonth() + 1}/${date.getDate()}`
          }}
        />
        <YAxis 
          stroke="#9ca3af"
          tick={{ fill: "#9ca3af", fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(17, 24, 39, 0.95)",
            border: "1px solid rgba(75, 85, 99, 0.5)",
            borderRadius: "0.5rem",
            backdropFilter: "blur(10px)"
          }}
          labelStyle={{ color: "#f3f4f6" }}
          itemStyle={{ color: chartColor }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={chartColor}
          strokeWidth={2}
          fill={`url(#gradient-${color})`}
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

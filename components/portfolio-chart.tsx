"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { mockPortfolioHistory } from "@/lib/mock-data"

export function PortfolioChart() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const latestValue = mockPortfolioHistory[mockPortfolioHistory.length - 1].value
  const firstValue = mockPortfolioHistory[0].value
  const growthPercent = (((latestValue - firstValue) / firstValue) * 100).toFixed(1)

  const chartColor = "#16a34a"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Portfolio Value</CardTitle>
            <CardDescription>Your investment growth over time</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{formatCurrency(latestValue)}</p>
            <p className="text-sm text-green-600 font-medium">+{growthPercent}% all time</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockPortfolioHistory}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  color: "#1f2937",
                }}
                formatter={(value: number) => [formatCurrency(value), "Value"]}
              />
              <Area type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

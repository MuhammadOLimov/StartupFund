"use client"

interface FundingProgressProps {
  current: number
  goal: number
  size?: "sm" | "md" | "lg"
}

export function FundingProgress({ current, goal, size = "md" }: FundingProgressProps) {
  const percentage = Math.min((current / goal) * 100, 100)

  const sizes = {
    sm: { width: 120, stroke: 8 },
    md: { width: 160, stroke: 12 },
    lg: { width: 200, stroke: 16 },
  }

  const { width, stroke } = sizes[size]
  const radius = (width - stroke) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
    return `$${amount}`
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={width} height={width} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-success transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{percentage.toFixed(0)}%</span>
        <span className="text-xs text-muted-foreground">Funded</span>
        <span className="text-sm font-semibold text-success mt-1">{formatCurrency(current)}</span>
      </div>
    </div>
  )
}

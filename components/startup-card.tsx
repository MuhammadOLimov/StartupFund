"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, Zap } from "lucide-react"
import type { Startup } from "@/lib/mock-data"
import Link from "next/link"

interface StartupCardProps {
  startup: Startup
  onInvest?: (startup: Startup) => void
}

export function StartupCard({ startup, onInvest }: StartupCardProps) {
  const fundingProgress = (startup.fundingRaised / startup.fundingGoal) * 100

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
    return `$${amount}`
  }

  const stageColors: Record<string, string> = {
    pre_seed: "bg-amber-100 text-amber-800",
    seed: "bg-emerald-100 text-emerald-800",
    series_a: "bg-blue-100 text-blue-800",
    series_b: "bg-purple-100 text-purple-800",
  }

  const stageLabels: Record<string, string> = {
    pre_seed: "Pre-Seed",
    seed: "Seed",
    series_a: "Series A",
    series_b: "Series B",
  }

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
      <div className="relative h-48 overflow-hidden">
        <img
          src={startup.heroImage || "/placeholder.svg"}
          alt={startup.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {startup.matchPercentage && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-success text-success-foreground font-semibold">
              <Zap className="w-3 h-3 mr-1" />
              {startup.matchPercentage}% Match
            </Badge>
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-bold text-white truncate">{startup.name}</h3>
          <p className="text-white/80 text-sm truncate">{startup.tagline}</p>
        </div>
      </div>

      <CardHeader className="pb-2 pt-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {startup.industry}
          </Badge>
          <Badge className={`text-xs ${stageColors[startup.stage]}`}>{stageLabels[startup.stage]}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Funding Progress</span>
            <span className="font-semibold text-foreground">{fundingProgress.toFixed(0)}%</span>
          </div>
          <Progress value={fundingProgress} className="h-2" />
          <div className="flex justify-between text-sm">
            <span className="text-success font-medium">{formatCurrency(startup.fundingRaised)}</span>
            <span className="text-muted-foreground">of {formatCurrency(startup.fundingGoal)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Valuation</p>
            <p className="font-semibold text-foreground">{formatCurrency(startup.valuation)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Equity</p>
            <p className="font-semibold text-foreground">{startup.equityOffered}%</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{startup.viewerCount} views</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/startup/${startup.id}`}>
                <TrendingUp className="w-4 h-4 mr-1" />
                Details
              </Link>
            </Button>
            {onInvest && (
              <Button
                size="sm"
                className="bg-success hover:bg-success/90 text-success-foreground"
                onClick={() => onInvest(startup)}
              >
                Invest
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SkeletonDashboard } from "@/components/ui/skeleton-card"
import { StartupCard } from "@/components/startup-card"
import { InvestModal } from "@/components/invest-modal"
import { PortfolioChart } from "@/components/portfolio-chart"
import { mockStartups, type Startup } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { useI18n } from "@/lib/i18n"
import { TrendingUp, DollarSign, Users, Eye, ArrowUpRight, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function InvestorDashboard() {
  const { user } = useAuth()
  const { t } = useI18n()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null)
  const [investModalOpen, setInvestModalOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleInvest = (startup: Startup) => {
    setSelectedStartup(startup)
    setInvestModalOpen(true)
  }

  if (isLoading) {
    return <SkeletonDashboard />
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("dashboard.investor.welcome")}, {user?.name || "Investor"}
          </h1>
          <p className="text-muted-foreground">{t("dashboard.investor.title")}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.investor.totalInvested")}
            </CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$90,000</div>
            <p className="text-xs text-muted-foreground">3 startups</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.investor.portfolio")}
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$105,500</div>
            <p className="text-xs text-success flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +17.2%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.investor.activeDeals")}
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3</div>
            <p className="text-xs text-muted-foreground">1 pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.investor.returns")}
            </CardTitle>
            <Eye className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">+$15,500</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Chart */}
      <PortfolioChart />

      {/* Top Matches */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">{t("dashboard.investor.topMatches")}</h2>
            <p className="text-muted-foreground">Startups aligned with your interests</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard/investor/marketplace">
              {t("dashboard.investor.viewAll")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockStartups.slice(0, 3).map((startup) => (
            <StartupCard key={startup.id} startup={startup} onInvest={handleInvest} />
          ))}
        </div>
      </div>

      {/* Investment Modal */}
      <InvestModal startup={selectedStartup} open={investModalOpen} onOpenChange={setInvestModalOpen} />
    </div>
  )
}

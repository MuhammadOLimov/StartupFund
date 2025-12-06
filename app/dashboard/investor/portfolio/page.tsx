"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PortfolioChart } from "@/components/portfolio-chart"
import { mockInvestments, mockStartups } from "@/lib/mock-data"
import { useI18n } from "@/lib/i18n"
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function PortfolioPage() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState("overview")

  const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.amount, 0)
  const currentValue = mockInvestments.reduce((sum, inv) => sum + inv.currentValue, 0)
  const totalReturns = currentValue - totalInvested
  const returnPercentage = ((totalReturns / totalInvested) * 100).toFixed(1)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const roiLabels: Record<string, string> = {
    equity: t("invest.equity"),
    convertible_note: t("invest.convertible"),
    revenue_share: t("invest.revenue"),
    safe: t("invest.safe"),
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("nav.portfolio")}</h1>
        <p className="text-muted-foreground mt-1">Track your investments and returns</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.investor.totalInvested")}
            </CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(totalInvested)}</div>
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
            <div className="text-2xl font-bold text-foreground">{formatCurrency(currentValue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.investor.returns")}
            </CardTitle>
            {totalReturns >= 0 ? (
              <TrendingUp className="w-4 h-4 text-success" />
            ) : (
              <TrendingDown className="w-4 h-4 text-destructive" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalReturns >= 0 ? "text-success" : "text-destructive"}`}>
              {totalReturns >= 0 ? "+" : ""}
              {formatCurrency(totalReturns)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              {returnPercentage}% all time
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.investor.activeDeals")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockInvestments.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockInvestments.filter((i) => i.status === "pending").length} pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <PortfolioChart />
        </TabsContent>

        <TabsContent value="investments" className="space-y-4">
          {mockInvestments.map((investment) => {
            const startup = mockStartups.find((s) => s.id === investment.startupId)
            const returnAmount = investment.currentValue - investment.amount
            const returnPct = ((returnAmount / investment.amount) * 100).toFixed(1)

            return (
              <Card key={investment.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{investment.startupName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{roiLabels[investment.roiStrategy]}</Badge>
                          <Badge
                            variant={
                              investment.status === "accepted"
                                ? "default"
                                : investment.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {investment.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 text-center md:text-right">
                      <div>
                        <p className="text-xs text-muted-foreground">Invested</p>
                        <p className="font-semibold text-foreground">{formatCurrency(investment.amount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Current Value</p>
                        <p className="font-semibold text-foreground">{formatCurrency(investment.currentValue)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Return</p>
                        <p className={`font-semibold ${returnAmount >= 0 ? "text-success" : "text-destructive"}`}>
                          {returnAmount >= 0 ? "+" : ""}
                          {returnPct}%
                        </p>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/startup/${investment.startupId}`}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>
    </div>
  )
}

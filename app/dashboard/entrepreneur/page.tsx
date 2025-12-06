"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SkeletonDashboard } from "@/components/ui/skeleton-card"
import { FundingProgress } from "@/components/funding-progress"
import { mockStartups } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { useI18n } from "@/lib/i18n"
import { TrendingUp, DollarSign, Users, Eye, ArrowUpRight, ArrowRight, CheckCircle2, Clock, Target } from "lucide-react"
import Link from "next/link"

export default function EntrepreneurDashboard() {
  const { user } = useAuth()
  const { t } = useI18n()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <SkeletonDashboard />
  }

  const myStartup = mockStartups[0] // Mock data

  const statusColors: Record<string, string> = {
    completed: "bg-success text-success-foreground",
    in_progress: "bg-primary text-primary-foreground",
    upcoming: "bg-muted text-muted-foreground",
  }

  const statusIcons: Record<string, typeof CheckCircle2> = {
    completed: CheckCircle2,
    in_progress: Clock,
    upcoming: Target,
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("dashboard.investor.welcome")}, {user?.name || "Founder"}
          </h1>
          <p className="text-muted-foreground">{t("dashboard.entrepreneur.title")}</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <span className="w-2 h-2 rounded-full bg-success mr-2" />
          Project Live
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.entrepreneur.fundingProgress")}
            </CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">65%</div>
            <p className="text-xs text-success flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +12% this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Amount Raised</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$1.63M</div>
            <p className="text-xs text-muted-foreground">of $2.5M goal</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.entrepreneur.profileViews")}
            </CardTitle>
            <Eye className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">234</div>
            <p className="text-xs text-success flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +18% this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.entrepreneur.investorInterest")}
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
            <p className="text-xs text-muted-foreground">3 pending offers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Funding Progress Widget */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t("dashboard.entrepreneur.fundingProgress")}</CardTitle>
            <CardDescription>Current round status</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <FundingProgress current={myStartup.fundingRaised} goal={myStartup.fundingGoal} size="lg" />
            <div className="mt-6 w-full space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Next milestone</span>
                <span className="font-medium text-foreground">Series A Ready</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("startup.equity")}</span>
                <span className="font-medium text-foreground">{myStartup.equityOffered}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("startup.valuation")}</span>
                <span className="font-medium text-foreground">$16M</span>
              </div>
            </div>
            <Button className="mt-6 w-full" asChild>
              <Link href="/dashboard/entrepreneur/startup">{t("dashboard.entrepreneur.editProfile")}</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t("dashboard.entrepreneur.milestones")}</CardTitle>
              <CardDescription>Track your progress</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/entrepreneur/milestones">
                {t("dashboard.investor.viewAll")}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myStartup.milestones.map((milestone, index) => {
                const StatusIcon = statusIcons[milestone.status]
                return (
                  <div key={milestone.id} className="flex items-start gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${statusColors[milestone.status]}`}
                    >
                      <StatusIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-foreground">{milestone.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {milestone.fundingPercentage}% funding
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{milestone.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">Target: {milestone.targetDate}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Investor Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("dashboard.entrepreneur.recentViewers")}</CardTitle>
            <CardDescription>Investors who viewed your profile</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/entrepreneur/investors">
              {t("dashboard.investor.viewAll")}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myStartup.investorInterests.length > 0 ? (
              myStartup.investorInterests.map((investor) => (
                <div key={investor.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={investor.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {investor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{investor.name}</p>
                      <p className="text-sm text-muted-foreground">Viewed {investor.viewedAt}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No investor activity yet</p>
                <p className="text-sm text-muted-foreground">Complete your profile to attract investors</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

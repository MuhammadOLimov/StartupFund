"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { SkeletonDashboard } from "@/components/ui/skeleton-card"
import { StartupCard } from "@/components/startup-card"
import { InvestModal } from "@/components/invest-modal"
import { FundingProgress } from "@/components/funding-progress"
import { PortfolioChart } from "@/components/portfolio-chart"
import { ProjectWizard } from "@/components/project-wizard"
import { mockStartups, type Startup } from "@/lib/mock-data"
import { TrendingUp, DollarSign, Users, Eye, ArrowUpRight, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null)
  const [investModalOpen, setInvestModalOpen] = useState(false)

  useEffect(() => {
    // Simulate loading
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

  const isEntrepreneur = user?.role === "entrepreneur"

  // Entrepreneur Dashboard
  if (isEntrepreneur) {
    const myStartup = mockStartups[0] // Mock: entrepreneur's startup

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name}</h1>
            <p className="text-muted-foreground">Manage your startup and track investor interest</p>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Funding Progress</CardTitle>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Profile Views</CardTitle>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Interested Investors</CardTitle>
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
              <CardTitle>Funding Progress</CardTitle>
              <CardDescription>Current round status</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <FundingProgress current={myStartup.fundingRaised} goal={myStartup.fundingGoal} size="lg" />
              <div className="mt-6 w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Next milestone</span>
                  <span className="font-medium text-foreground">Series A Ready</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Equity offered</span>
                  <span className="font-medium text-foreground">{myStartup.equityOffered}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Investor Activity */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Investor Activity</CardTitle>
                <CardDescription>Investors who viewed your profile</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/investors">
                  View all
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myStartup.investorInterests.map((investor) => (
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
                ))}
                {myStartup.investorInterests.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No investor activity yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Edit Section */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Project Update</CardTitle>
            <CardDescription>Keep your startup profile up to date to attract more investors</CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectWizard />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Investor Dashboard
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">Discover and manage your investments</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Invested</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$90,000</div>
            <p className="text-xs text-muted-foreground">Across 3 startups</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Value</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$105,500</div>
            <p className="text-xs text-success flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +17.2% all time
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Investments</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3</div>
            <p className="text-xs text-muted-foreground">1 pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Match Score</CardTitle>
            <Eye className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">82%</div>
            <p className="text-xs text-muted-foreground">Based on preferences</p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Chart */}
      <PortfolioChart />

      {/* Top Matches */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Top Matches for You</h2>
            <p className="text-muted-foreground">Startups aligned with your investment interests</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard/marketplace">
              View Marketplace
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

"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { InvestModal } from "@/components/invest-modal"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { useI18n } from "@/lib/i18n"
import { mockStartups, type Startup } from "@/lib/mock-data"
import {
  ArrowLeft,
  Play,
  Target,
  FileText,
  CheckCircle2,
  Clock,
  Circle,
  Linkedin,
  Download,
  Eye,
  Globe,
  Mail,
} from "lucide-react"
import { toast } from "sonner"

export default function StartupPage() {
  const params = useParams()
  const { t } = useI18n()
  const [startup, setStartup] = useState<Startup | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [investModalOpen, setInvestModalOpen] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      const found = mockStartups.find((s) => s.id === params.id)
      setStartup(found || null)
      setIsLoading(false)
    }, 500)
  }, [params.id])

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
    return `$${amount}`
  }

  const stageColors: Record<string, string> = {
    pre_seed: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    seed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    series_a: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    series_b: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  }

  const stageLabels: Record<string, string> = {
    pre_seed: "Pre-Seed",
    seed: "Seed",
    series_a: "Series A",
    series_b: "Series B",
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-[400px] relative">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="container mx-auto px-4 py-8 space-y-8">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-6 w-2/3" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    )
  }

  if (!startup) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Startup not found</h1>
          <Button asChild>
            <Link href="/dashboard/investor/marketplace">Back to Marketplace</Link>
          </Button>
        </div>
      </div>
    )
  }

  const fundingProgress = (startup.fundingRaised / startup.fundingGoal) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px]">
        <img src={startup.heroImage || "/placeholder.svg"} alt={startup.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Top Navigation */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <Button variant="secondary" size="sm" asChild>
            <Link href="/dashboard/investor/marketplace">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        {/* Video Play Button */}
        {startup.videoUrl && (
          <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
            <Play className="w-8 h-8 text-white fill-white" />
          </button>
        )}

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{startup.industry}</Badge>
              <Badge className={stageColors[startup.stage]}>{stageLabels[startup.stage]}</Badge>
              {startup.matchPercentage && (
                <Badge className="bg-success text-success-foreground">
                  {startup.matchPercentage}% {t("marketplace.match")}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{startup.name}</h1>
            <p className="text-xl text-white/90 max-w-2xl">{startup.tagline}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">{t("startup.overview")}</TabsTrigger>
                <TabsTrigger value="team">{t("startup.team")}</TabsTrigger>
                <TabsTrigger value="financials">{t("startup.financials")}</TabsTrigger>
                <TabsTrigger value="roadmap">{t("startup.roadmap")}</TabsTrigger>
                <TabsTrigger value="documents">{t("startup.documents")}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("startup.about")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{startup.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("startup.problem")} & {t("startup.solution")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-medium text-foreground">{startup.pitch}</p>
                  </CardContent>
                </Card>

                {/* Links Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t("startup.links")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" size="sm">
                        <Globe className="w-4 h-4 mr-2" />
                        Website
                      </Button>
                      <Button variant="outline" size="sm">
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="team" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {startup.team.map((member) => (
                    <Card key={member.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground">{member.name}</h3>
                              {member.linkedin && (
                                <a
                                  href={member.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-primary"
                                >
                                  <Linkedin className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                            <p className="text-sm text-primary font-medium">{member.role}</p>
                            <p className="text-sm text-muted-foreground mt-2">{member.bio}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="financials" className="space-y-6">
                {/* Market Opportunity */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t("startup.market")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-xs text-muted-foreground mb-1">{t("startup.tam")}</p>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(startup.tam)}</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-success/5 border border-success/20">
                        <p className="text-xs text-muted-foreground mb-1">{t("startup.sam")}</p>
                        <p className="text-2xl font-bold text-success">{formatCurrency(startup.sam)}</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted">
                        <p className="text-xs text-muted-foreground mb-1">{t("startup.som")}</p>
                        <p className="text-2xl font-bold text-foreground">{formatCurrency(startup.som)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Funding Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Funding Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t("marketplace.goal")}</p>
                        <p className="text-xl font-bold text-foreground">{formatCurrency(startup.fundingGoal)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("marketplace.raised")}</p>
                        <p className="text-xl font-bold text-success">{formatCurrency(startup.fundingRaised)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("startup.valuation")}</p>
                        <p className="text-xl font-bold text-foreground">{formatCurrency(startup.valuation)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("startup.equity")}</p>
                        <p className="text-xl font-bold text-foreground">{startup.equityOffered}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="roadmap" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      {t("startup.roadmap")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {startup.milestones.map((milestone, index) => (
                        <div key={milestone.id} className="flex gap-4 pb-8 last:pb-0">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                milestone.status === "completed"
                                  ? "bg-success text-success-foreground"
                                  : milestone.status === "in_progress"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {milestone.status === "completed" ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : milestone.status === "in_progress" ? (
                                <Clock className="w-4 h-4" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                            </div>
                            {index < startup.milestones.length - 1 && (
                              <div
                                className={`w-0.5 flex-1 mt-2 ${
                                  milestone.status === "completed" ? "bg-success" : "bg-border"
                                }`}
                              />
                            )}
                          </div>
                          <div className="flex-1 pb-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-foreground">{milestone.title}</h4>
                                <p className="text-sm text-muted-foreground">{milestone.description}</p>
                              </div>
                              <Badge variant="outline" className="ml-2 shrink-0">
                                {milestone.fundingPercentage}%
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Target: {new Date(milestone.targetDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                {startup.documents.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">No Documents</h3>
                      <p className="text-muted-foreground">Documents will be uploaded soon.</p>
                    </CardContent>
                  </Card>
                ) : (
                  startup.documents.map((doc, index) => (
                    <Card key={index}>
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{doc.name}</p>
                              <p className="text-sm text-muted-foreground">PDF</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => toast.info(`Viewing: ${doc.name}`)}>
                              <Eye className="w-4 h-4 mr-2" />
                              {t("common.view")}
                            </Button>
                            <Button size="sm" onClick={() => toast.success(`Downloaded: ${doc.name}`)}>
                              <Download className="w-4 h-4 mr-2" />
                              {t("common.download")}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Investment Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("startup.investNow")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("dashboard.entrepreneur.fundingProgress")}</span>
                      <span className="font-semibold text-foreground">{fundingProgress.toFixed(0)}%</span>
                    </div>
                    <Progress value={fundingProgress} className="h-3" />
                    <div className="flex justify-between text-sm">
                      <span className="text-success font-medium">{formatCurrency(startup.fundingRaised)}</span>
                      <span className="text-muted-foreground">of {formatCurrency(startup.fundingGoal)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("startup.valuation")}</span>
                      <span className="font-semibold text-foreground">{formatCurrency(startup.valuation)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("startup.equity")}</span>
                      <span className="font-semibold text-foreground">{startup.equityOffered}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("startup.minInvestment")}</span>
                      <span className="font-semibold text-foreground">$1,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("startup.investors")}</span>
                      <span className="font-semibold text-foreground">{startup.viewerCount}</span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-success hover:bg-success/90 text-success-foreground"
                    onClick={() => setInvestModalOpen(true)}
                  >
                    {t("startup.investNow")}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">Platform fee: 5% of investment amount</p>
                </CardContent>
              </Card>

              {/* Obligations Card */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("startup.obligations")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-muted-foreground">Quarterly financial reports</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-muted-foreground">Milestone progress updates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-muted-foreground">Annual investor meetings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-muted-foreground">Exit strategy transparency</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <InvestModal startup={startup} open={investModalOpen} onOpenChange={setInvestModalOpen} />
    </div>
  )
}

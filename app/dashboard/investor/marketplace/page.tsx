"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StartupCard } from "@/components/startup-card"
import { InvestModal } from "@/components/invest-modal"
import { SkeletonCard } from "@/components/ui/skeleton-card"
import { mockStartups, industries, stages, type Startup } from "@/lib/mock-data"
import { useI18n } from "@/lib/i18n"
import { Search, X, Grid, List } from "lucide-react"

export default function MarketplacePage() {
  const { t } = useI18n()
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [industry, setIndustry] = useState("all")
  const [stage, setStage] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null)
  const [investModalOpen, setInvestModalOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleInvest = (startup: Startup) => {
    setSelectedStartup(startup)
    setInvestModalOpen(true)
  }

  const filteredStartups = mockStartups.filter((startup) => {
    const matchesSearch =
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.tagline.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesIndustry = industry === "all" || startup.industry === industry
    const matchesStage = stage === "all" || startup.stage === stage
    return matchesSearch && matchesIndustry && matchesStage
  })

  const hasActiveFilters = searchQuery || industry !== "all" || stage !== "all"

  const clearFilters = () => {
    setSearchQuery("")
    setIndustry("all")
    setStage("all")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("marketplace.title")}</h1>
        <p className="text-muted-foreground mt-1">Discover and invest in promising startups</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("marketplace.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t("marketplace.industry")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("marketplace.allIndustries")}</SelectItem>
            {industries.map((ind) => (
              <SelectItem key={ind} value={ind}>
                {ind}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder={t("marketplace.stage")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("marketplace.allStages")}</SelectItem>
            {stages.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className="bg-transparent"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
            className="bg-transparent"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">{t("marketplace.filters")}:</span>
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              {searchQuery}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery("")} />
            </Badge>
          )}
          {industry !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {industry}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setIndustry("all")} />
            </Badge>
          )}
          {stage !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {stages.find((s) => s.value === stage)?.label}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setStage("all")} />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        </div>
      )}

      {/* Results */}
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          {filteredStartups.length} startup{filteredStartups.length !== 1 ? "s" : ""} found
        </p>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredStartups.length > 0 ? (
          <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-4"}>
            {filteredStartups.map((startup) => (
              <StartupCard key={startup.id} startup={startup} onInvest={handleInvest} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No startups found matching your criteria</p>
            <Button variant="link" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        )}
      </div>

      <InvestModal startup={selectedStartup} open={investModalOpen} onOpenChange={setInvestModalOpen} />
    </div>
  )
}

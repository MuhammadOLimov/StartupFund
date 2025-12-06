"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StartupCard } from "@/components/startup-card"
import { InvestModal } from "@/components/invest-modal"
import { SkeletonCard } from "@/components/ui/skeleton-card"
import { mockStartups, type Startup } from "@/lib/mock-data"
import { Search, SlidersHorizontal, X } from "lucide-react"

const INDUSTRIES = ["All", "Artificial Intelligence", "FinTech", "HealthTech", "CleanTech"]
const STAGES = ["All", "Pre-Seed", "Seed", "Series A", "Series B"]

export default function MarketplacePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [industry, setIndustry] = useState("All")
  const [stage, setStage] = useState("All")
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
    const matchesIndustry = industry === "All" || startup.industry === industry
    const matchesStage =
      stage === "All" || startup.stage.replace("_", " ").toLowerCase() === stage.toLowerCase().replace("-", " ")
    return matchesSearch && matchesIndustry && matchesStage
  })

  const hasActiveFilters = searchQuery || industry !== "All" || stage !== "All"

  const clearFilters = () => {
    setSearchQuery("")
    setIndustry("All")
    setStage("All")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Startup Marketplace</h1>
        <p className="text-muted-foreground mt-1">Discover and invest in promising startups</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search startups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRIES.map((ind) => (
              <SelectItem key={ind} value={ind}>
                {ind}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            {STAGES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2 bg-transparent">
          <SlidersHorizontal className="w-4 h-4" />
          More Filters
        </Button>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchQuery}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery("")} />
            </Badge>
          )}
          {industry !== "All" && (
            <Badge variant="secondary" className="gap-1">
              {industry}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setIndustry("All")} />
            </Badge>
          )}
          {stage !== "All" && (
            <Badge variant="secondary" className="gap-1">
              {stage}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setStage("All")} />
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
          Showing {filteredStartups.length} startup{filteredStartups.length !== 1 ? "s" : ""}
        </p>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredStartups.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

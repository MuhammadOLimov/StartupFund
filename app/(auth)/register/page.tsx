"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useI18n } from "@/lib/i18n"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { TrendingUp, Rocket, PiggyBank, Loader2, X } from "lucide-react"

const INDUSTRIES = ["AI/ML", "FinTech", "HealthTech", "CleanTech", "E-Commerce", "SaaS", "Crypto", "Gaming"]

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get("role") || "investor"
  const { register, isLoading } = useAuth()
  const { t } = useI18n()

  const [role, setRole] = useState<"investor" | "entrepreneur">(defaultRole as "investor" | "entrepreneur")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    projectName: "",
    investmentInterests: [] as string[],
  })

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      investmentInterests: prev.investmentInterests.includes(interest)
        ? prev.investmentInterests.filter((i) => i !== interest)
        : [...prev.investmentInterests, interest],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await register({
      ...formData,
      role,
    })
    router.push(role === "investor" ? "/dashboard/investor" : "/dashboard/entrepreneur")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl text-foreground">StartupFund</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{t("auth.register.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("auth.register.description")}</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Tabs value={role} onValueChange={(v) => setRole(v as "investor" | "entrepreneur")} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="investor" className="gap-2">
                  <PiggyBank className="w-4 h-4" />
                  {t("auth.investor")}
                </TabsTrigger>
                <TabsTrigger value="entrepreneur" className="gap-2">
                  <Rocket className="w-4 h-4" />
                  {t("auth.entrepreneur")}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="mb-4 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
              {role === "investor" ? t("auth.investorDesc") : t("auth.entrepreneurDesc")}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("auth.name")}</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              {/* Role-specific fields */}
              {role === "entrepreneur" && (
                <div className="space-y-2">
                  <Label htmlFor="projectName">{t("auth.projectName")}</Label>
                  <Input
                    id="projectName"
                    placeholder="Your startup name"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  />
                </div>
              )}

              {role === "investor" && (
                <div className="space-y-2">
                  <Label>{t("auth.investmentInterests")}</Label>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.map((industry) => (
                      <Badge
                        key={industry}
                        variant={formData.investmentInterests.includes(industry) ? "default" : "outline"}
                        className="cursor-pointer transition-all"
                        onClick={() => toggleInterest(industry)}
                      >
                        {industry}
                        {formData.investmentInterests.includes(industry) && <X className="w-3 h-3 ml-1" />}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("common.loading")}
                  </>
                ) : (
                  t("auth.registerButton")
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">{t("auth.hasAccount")} </span>
              <Link href={`/login?role=${role}`} className="text-primary hover:underline font-medium">
                {t("auth.signIn")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

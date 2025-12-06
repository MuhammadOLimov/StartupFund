"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { useI18n } from "@/lib/i18n"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { TrendingUp, Rocket, PiggyBank, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get("role") || "investor"
  const { login, isLoading } = useAuth()
  const { t } = useI18n()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"investor" | "entrepreneur">(defaultRole as "investor" | "entrepreneur")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password, role)
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
          <h1 className="text-2xl font-bold text-foreground">{t("auth.login.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("auth.login.description")}</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <Tabs value={role} onValueChange={(v) => setRole(v as "investor" | "entrepreneur")}>
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
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("common.loading")}
                  </>
                ) : (
                  t("auth.loginButton")
                )}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">{t("auth.noAccount")} </span>
              <Link href={`/register?role=${role}`} className="text-primary hover:underline font-medium">
                {t("auth.signUp")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

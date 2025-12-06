"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { useI18n } from "@/lib/i18n"
import {
  TrendingUp,
  Rocket,
  PiggyBank,
  Shield,
  ArrowRight,
  CheckCircle2,
  Users,
  DollarSign,
  BarChart3,
} from "lucide-react"

export default function LandingPage() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">StartupFund</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.features")}
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.howItWorks")}
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.login")}
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button asChild className="hidden md:flex">
              <Link href="/register">{t("nav.getStarted")}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-success/5" />
        </div>
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6">
              {t("hero.badge")}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-foreground text-balance">
              {t("hero.title.where")} {t("hero.title.1")} <span className="text-primary">{t("hero.title.2")}</span>{" "}
              {t("hero.title.meets")} {t("hero.title.3")} <span className="text-success">{t("hero.title.4")}</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">{t("hero.description")}</p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="w-full sm:w-auto gap-2">
                <Link href="/register?role=entrepreneur">
                  <Rocket className="w-5 h-5" />
                  {t("hero.entrepreneur")}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto gap-2 bg-transparent">
                <Link href="/register?role=investor">
                  <PiggyBank className="w-5 h-5" />
                  {t("hero.investor")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: t("stats.totalRaised"), value: "$120M+", icon: DollarSign },
              { label: t("stats.activeStartups"), value: "500+", icon: Rocket },
              { label: t("stats.investors"), value: "2,000+", icon: Users },
              { label: t("stats.successRate"), value: "78%", icon: BarChart3 },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">{t("features.title")}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t("features.description")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: t("features.milestone.title"),
                description: t("features.milestone.desc"),
                icon: CheckCircle2,
              },
              {
                title: t("features.matching.title"),
                description: t("features.matching.desc"),
                icon: TrendingUp,
              },
              {
                title: t("features.security.title"),
                description: t("features.security.desc"),
                icon: Shield,
              },
              {
                title: t("features.analytics.title"),
                description: t("features.analytics.desc"),
                icon: BarChart3,
              },
              {
                title: t("features.roi.title"),
                description: t("features.roi.desc"),
                icon: DollarSign,
              },
              {
                title: t("features.dueDiligence.title"),
                description: t("features.dueDiligence.desc"),
                icon: Users,
              },
            ].map((feature) => (
              <Card key={feature.title} className="border-border/50 hover:border-primary/20 transition-colors">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">{t("howItWorks.title")}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t("howItWorks.description")}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* For Entrepreneurs */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                {t("howItWorks.forEntrepreneurs")}
              </h3>
              {[
                { step: 1, title: t("howItWorks.e.step1.title"), desc: t("howItWorks.e.step1.desc") },
                { step: 2, title: t("howItWorks.e.step2.title"), desc: t("howItWorks.e.step2.desc") },
                { step: 3, title: t("howItWorks.e.step3.title"), desc: t("howItWorks.e.step3.desc") },
                { step: 4, title: t("howItWorks.e.step4.title"), desc: t("howItWorks.e.step4.desc") },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* For Investors */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-success flex items-center gap-2">
                <PiggyBank className="w-5 h-5" />
                {t("howItWorks.forInvestors")}
              </h3>
              {[
                { step: 1, title: t("howItWorks.i.step1.title"), desc: t("howItWorks.i.step1.desc") },
                { step: 2, title: t("howItWorks.i.step2.title"), desc: t("howItWorks.i.step2.desc") },
                { step: 3, title: t("howItWorks.i.step3.title"), desc: t("howItWorks.i.step3.desc") },
                { step: 4, title: t("howItWorks.i.step4.title"), desc: t("howItWorks.i.step4.desc") },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-success text-success-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground overflow-hidden">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">{t("cta.title")}</h2>
              <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">{t("cta.description")}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/register">
                    {t("cta.button")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">StartupFund</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 StartupFund. {t("footer.rights")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

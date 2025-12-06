"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { useI18n } from "@/lib/i18n"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  LayoutDashboard,
  Settings,
  LogOut,
  TrendingUp,
  Users,
  FileText,
  PieChart,
  Menu,
  X,
  Rocket,
  Target,
} from "lucide-react"
import { useState } from "react"

export function DashboardNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { t } = useI18n()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isEntrepreneur = user?.role === "entrepreneur"

  const entrepreneurLinks = [
    { href: "/dashboard/entrepreneur", label: t("dashboard.entrepreneur.title"), icon: LayoutDashboard },
    { href: "/dashboard/entrepreneur/startup", label: t("dashboard.entrepreneur.manageStartup"), icon: Rocket },
    { href: "/dashboard/entrepreneur/milestones", label: t("dashboard.entrepreneur.milestones"), icon: Target },
    { href: "/dashboard/entrepreneur/investors", label: t("dashboard.entrepreneur.recentViewers"), icon: Users },
  ]

  const investorLinks = [
    { href: "/dashboard/investor", label: t("dashboard.investor.title"), icon: LayoutDashboard },
    { href: "/dashboard/investor/marketplace", label: t("nav.marketplace"), icon: TrendingUp },
    { href: "/dashboard/investor/portfolio", label: t("nav.portfolio"), icon: PieChart },
    { href: "/dashboard/investor/documents", label: t("startup.documents"), icon: FileText },
  ]

  const links = isEntrepreneur ? entrepreneurLinks : investorLinks

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg hidden sm:inline text-foreground">StartupFund</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("gap-2", pathname === link.href && "bg-muted text-foreground")}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t("nav.settings")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("nav.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container px-4 py-4 flex flex-col gap-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", pathname === link.href && "bg-muted")}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

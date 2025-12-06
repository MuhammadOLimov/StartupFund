import type React from "react"
import { AuthProvider } from "@/lib/auth-context"
import { DashboardNav } from "@/components/dashboard-nav"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </AuthProvider>
  )
}

"use client"

import { ProjectWizard } from "@/components/project-wizard"
import { useI18n } from "@/lib/i18n"

export default function StartupManagementPage() {
  const { t } = useI18n()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("dashboard.entrepreneur.manageStartup")}</h1>
        <p className="text-muted-foreground mt-1">Keep your startup profile up to date</p>
      </div>

      <ProjectWizard />
    </div>
  )
}

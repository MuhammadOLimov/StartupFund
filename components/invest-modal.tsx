"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle2, TrendingUp, Shield, Zap, Loader2 } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import type { Startup } from "@/lib/mock-data"

interface InvestModalProps {
  startup: Startup | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InvestModal({ startup, open, onOpenChange }: InvestModalProps) {
  const { t } = useI18n()
  const [amount, setAmount] = useState([25000])
  const [roiStrategy, setRoiStrategy] = useState<string>("equity")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState<"configure" | "confirm" | "success">("configure")

  const ROI_STRATEGIES = [
    {
      value: "equity",
      label: t("invest.equity"),
      description: t("invest.equityDesc"),
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      value: "convertible_note",
      label: t("invest.convertible"),
      description: t("invest.convertibleDesc"),
      icon: Shield,
      color: "text-amber-500",
    },
    {
      value: "revenue_share",
      label: t("invest.revenue"),
      description: t("invest.revenueDesc"),
      icon: Zap,
      color: "text-purple-500",
    },
    {
      value: "safe",
      label: t("invest.safe"),
      description: t("invest.safeDesc"),
      icon: CheckCircle2,
      color: "text-success",
    },
  ]

  if (!startup) return null

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const estimatedEquity = ((amount[0] / startup.valuation) * 100).toFixed(3)
  const platformFee = amount[0] * 0.05
  const totalAmount = amount[0] + platformFee

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setStep("success")
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      setStep("configure")
      setAmount([25000])
      setRoiStrategy("equity")
    }, 300)
  }

  // Success screen
  if (step === "success") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[400px] text-center">
          <div className="py-8">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{t("invest.success")}</h2>
            <p className="text-muted-foreground mb-6">{t("invest.successDesc")}</p>
            <div className="space-y-2 text-sm bg-muted/50 rounded-lg p-4 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Startup</span>
                <span className="font-medium text-foreground">{startup.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("invest.amount")}</span>
                <span className="font-medium text-foreground">{formatCurrency(amount[0])}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("invest.strategy")}</span>
                <span className="font-medium text-foreground">
                  {ROI_STRATEGIES.find((s) => s.value === roiStrategy)?.label}
                </span>
              </div>
            </div>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {t("invest.title")}: {startup.name}
          </DialogTitle>
          <DialogDescription>
            Configure your investment. The startup will review within 5 business days.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Amount Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">{t("invest.amount")}</Label>
              <span className="text-2xl font-bold text-primary">{formatCurrency(amount[0])}</span>
            </div>
            <Slider value={amount} onValueChange={setAmount} min={1000} max={100000} step={1000} className="py-4" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$1,000</span>
              <span>$100,000</span>
            </div>
          </div>

          <Separator />

          {/* ROI Strategy Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{t("invest.strategy")}</Label>
            <RadioGroup value={roiStrategy} onValueChange={setRoiStrategy} className="grid grid-cols-2 gap-3">
              {ROI_STRATEGIES.map((strategy) => (
                <div key={strategy.value}>
                  <RadioGroupItem value={strategy.value} id={strategy.value} className="peer sr-only" />
                  <Label
                    htmlFor={strategy.value}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-all hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5`}
                  >
                    <strategy.icon className={`w-6 h-6 ${strategy.color}`} />
                    <span className="font-medium text-sm text-foreground">{strategy.label}</span>
                    <span className="text-xs text-muted-foreground text-center">{strategy.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Summary Card */}
          <Card className="p-4 bg-muted/50">
            <h4 className="font-semibold mb-3 text-foreground">{t("invest.summary")}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("invest.amount")}</span>
                <span className="font-medium text-foreground">{formatCurrency(amount[0])}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("invest.platformFee")}</span>
                <span className="font-medium text-foreground">{formatCurrency(platformFee)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">{t("invest.total")}</span>
                <span className="font-bold text-primary">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-muted-foreground">Estimated {t("startup.equity")}</span>
                <Badge variant="secondary">{estimatedEquity}%</Badge>
              </div>
            </div>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {t("invest.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-success hover:bg-success/90 text-success-foreground"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("common.loading")}
              </>
            ) : (
              t("invest.confirm")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

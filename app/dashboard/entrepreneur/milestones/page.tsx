"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockStartups } from "@/lib/mock-data"
import { useI18n } from "@/lib/i18n"
import { CheckCircle2, Clock, Target, Plus, Calendar, DollarSign } from "lucide-react"
import { toast } from "sonner"

export default function MilestonesPage() {
  const { t } = useI18n()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    targetDate: "",
    fundingPercentage: "",
    status: "upcoming",
  })

  const myStartup = mockStartups[0]

  const statusColors: Record<string, string> = {
    completed: "border-success bg-success/10",
    in_progress: "border-primary bg-primary/10",
    upcoming: "border-muted bg-muted/50",
  }

  const statusLabels: Record<string, string> = {
    completed: t("common.completed"),
    in_progress: t("common.inProgress"),
    upcoming: t("common.notStarted"),
  }

  const statusIcons: Record<string, typeof CheckCircle2> = {
    completed: CheckCircle2,
    in_progress: Clock,
    upcoming: Target,
  }

  const handleAddMilestone = () => {
    toast.success("Milestone added!", {
      description: `"${newMilestone.title}" has been added to your roadmap.`,
    })
    setIsDialogOpen(false)
    setNewMilestone({
      title: "",
      description: "",
      targetDate: "",
      fundingPercentage: "",
      status: "upcoming",
    })
  }

  const completedMilestones = myStartup.milestones.filter((m) => m.status === "completed").length
  const totalMilestones = myStartup.milestones.length
  const progressPercentage = (completedMilestones / totalMilestones) * 100

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("dashboard.entrepreneur.milestones")}</h1>
          <p className="text-muted-foreground mt-1">{t("startup.roadmap")}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t("dashboard.entrepreneur.addMilestone")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("dashboard.entrepreneur.addMilestone")}</DialogTitle>
              <DialogDescription>Define a new milestone for your roadmap</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  placeholder="e.g., Launch MVP"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                  placeholder="Describe this milestone..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target Date</Label>
                  <Input
                    type="date"
                    value={newMilestone.targetDate}
                    onChange={(e) => setNewMilestone({ ...newMilestone, targetDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Funding %</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={newMilestone.fundingPercentage}
                    onChange={(e) => setNewMilestone({ ...newMilestone, fundingPercentage: e.target.value })}
                    placeholder="25"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={newMilestone.status}
                  onValueChange={(v) => setNewMilestone({ ...newMilestone, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">{t("common.notStarted")}</SelectItem>
                    <SelectItem value="in_progress">{t("common.inProgress")}</SelectItem>
                    <SelectItem value="completed">{t("common.completed")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button onClick={handleAddMilestone}>{t("common.add")}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>
            {completedMilestones} of {totalMilestones} milestones completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{progressPercentage.toFixed(0)}% complete</span>
            <span>{totalMilestones - completedMilestones} remaining</span>
          </div>
        </CardContent>
      </Card>

      {/* Milestones Timeline */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
        <div className="space-y-6">
          {myStartup.milestones.map((milestone, index) => {
            const StatusIcon = statusIcons[milestone.status]
            return (
              <div key={milestone.id} className="relative pl-12">
                <div
                  className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    milestone.status === "completed"
                      ? "border-success bg-success text-success-foreground"
                      : milestone.status === "in_progress"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground bg-background"
                  }`}
                >
                  <StatusIcon className="w-4 h-4" />
                </div>

                <Card className={`border-l-4 ${statusColors[milestone.status]}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{milestone.title}</CardTitle>
                      <Badge variant={milestone.status === "completed" ? "default" : "secondary"}>
                        {statusLabels[milestone.status]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{milestone.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Target: {milestone.targetDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="w-4 h-4" />
                        <span>{milestone.fundingPercentage}% of funding unlocked</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

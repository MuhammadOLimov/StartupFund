"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Check, Plus, Trash2, Building2, DollarSign, Users, Target } from "lucide-react"
import { toast } from "sonner"

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
}

interface Milestone {
  id: string
  title: string
  description: string
  targetDate: string
  fundingPercentage: number
}

const STEPS = [
  { id: 1, title: "General Info", icon: Building2 },
  { id: 2, title: "Financials", icon: DollarSign },
  { id: 3, title: "Team", icon: Users },
  { id: 4, title: "Roadmap", icon: Target },
]

export function ProjectWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    pitch: "",
    description: "",
    industry: "",
    stage: "",
    fundingGoal: "",
    equityOffered: "",
    valuation: "",
    tam: "",
    sam: "",
    som: "",
  })
  const [team, setTeam] = useState<TeamMember[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])

  const progress = (currentStep / STEPS.length) * 100

  const addTeamMember = () => {
    setTeam([...team, { id: Date.now().toString(), name: "", role: "", bio: "" }])
  }

  const removeTeamMember = (id: string) => {
    setTeam(team.filter((m) => m.id !== id))
  }

  const updateTeamMember = (id: string, field: keyof TeamMember, value: string) => {
    setTeam(team.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
  }

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        id: Date.now().toString(),
        title: "",
        description: "",
        targetDate: "",
        fundingPercentage: 0,
      },
    ])
  }

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id))
  }

  const updateMilestone = (id: string, field: keyof Milestone, value: string | number) => {
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
  }

  const handleSubmit = () => {
    toast.success("Project Updated!", {
      description: "Your startup profile has been saved successfully.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Project Editor</h2>
          <Badge variant="secondary">
            Step {currentStep} of {STEPS.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between">
          {STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                step.id === currentStep
                  ? "text-primary"
                  : step.id < currentStep
                    ? "text-success"
                    : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step.id === currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : step.id < currentStep
                      ? "border-success bg-success text-success-foreground"
                      : "border-muted-foreground"
                }`}
              >
                {step.id < currentStep ? <Check className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
              </div>
              <span className="hidden sm:inline">{step.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
          <CardDescription>
            {currentStep === 1 && "Tell us about your startup"}
            {currentStep === 2 && "Define your funding requirements"}
            {currentStep === 3 && "Introduce your team"}
            {currentStep === 4 && "Set your milestones and roadmap"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: General Info */}
          {currentStep === 1 && (
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Startup Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., NeuralFlow AI"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="One line that captures your vision"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pitch">Elevator Pitch</Label>
                <Textarea
                  id="pitch"
                  value={formData.pitch}
                  onChange={(e) => setFormData({ ...formData, pitch: e.target.value })}
                  placeholder="60 seconds pitch - what problem do you solve?"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of your product and vision"
                  rows={5}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={formData.industry} onValueChange={(v) => setFormData({ ...formData, industry: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai">Artificial Intelligence</SelectItem>
                      <SelectItem value="fintech">FinTech</SelectItem>
                      <SelectItem value="healthtech">HealthTech</SelectItem>
                      <SelectItem value="cleantech">CleanTech</SelectItem>
                      <SelectItem value="ecommerce">E-Commerce</SelectItem>
                      <SelectItem value="saas">SaaS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stage">Stage</Label>
                  <Select value={formData.stage} onValueChange={(v) => setFormData({ ...formData, stage: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre_seed">Pre-Seed</SelectItem>
                      <SelectItem value="seed">Seed</SelectItem>
                      <SelectItem value="series_a">Series A</SelectItem>
                      <SelectItem value="series_b">Series B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Financials */}
          {currentStep === 2 && (
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fundingGoal">Funding Goal ($)</Label>
                  <Input
                    id="fundingGoal"
                    type="number"
                    value={formData.fundingGoal}
                    onChange={(e) => setFormData({ ...formData, fundingGoal: e.target.value })}
                    placeholder="2,500,000"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="equityOffered">Equity Offered (%)</Label>
                  <Input
                    id="equityOffered"
                    type="number"
                    value={formData.equityOffered}
                    onChange={(e) => setFormData({ ...formData, equityOffered: e.target.value })}
                    placeholder="15"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="valuation">Pre-Money Valuation ($)</Label>
                <Input
                  id="valuation"
                  type="number"
                  value={formData.valuation}
                  onChange={(e) => setFormData({ ...formData, valuation: e.target.value })}
                  placeholder="16,000,000"
                />
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Market Size (TAM/SAM/SOM)</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tam">TAM ($)</Label>
                    <Input
                      id="tam"
                      type="number"
                      value={formData.tam}
                      onChange={(e) => setFormData({ ...formData, tam: e.target.value })}
                      placeholder="50B"
                    />
                    <p className="text-xs text-muted-foreground">Total Addressable Market</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sam">SAM ($)</Label>
                    <Input
                      id="sam"
                      type="number"
                      value={formData.sam}
                      onChange={(e) => setFormData({ ...formData, sam: e.target.value })}
                      placeholder="5B"
                    />
                    <p className="text-xs text-muted-foreground">Serviceable Available</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="som">SOM ($)</Label>
                    <Input
                      id="som"
                      type="number"
                      value={formData.som}
                      onChange={(e) => setFormData({ ...formData, som: e.target.value })}
                      placeholder="500M"
                    />
                    <p className="text-xs text-muted-foreground">Serviceable Obtainable</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Team */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {team.map((member, index) => (
                <Card key={member.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage
                        src={`/diverse-team-meeting.png?height=64&width=64&query=team member ${index + 1}`}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {member.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 grid gap-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Full Name"
                          value={member.name}
                          onChange={(e) => updateTeamMember(member.id, "name", e.target.value)}
                        />
                        <Input
                          placeholder="Role (e.g., CEO)"
                          value={member.role}
                          onChange={(e) => updateTeamMember(member.id, "role", e.target.value)}
                        />
                      </div>
                      <Textarea
                        placeholder="Short bio and background"
                        value={member.bio}
                        onChange={(e) => updateTeamMember(member.id, "bio", e.target.value)}
                        rows={2}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTeamMember(member.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
              <Button variant="outline" onClick={addTeamMember} className="w-full bg-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            </div>
          )}

          {/* Step 4: Roadmap */}
          {currentStep === 4 && (
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <Card key={milestone.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 grid gap-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Milestone Title"
                          value={milestone.title}
                          onChange={(e) => updateMilestone(milestone.id, "title", e.target.value)}
                        />
                        <Input
                          type="date"
                          value={milestone.targetDate}
                          onChange={(e) => updateMilestone(milestone.id, "targetDate", e.target.value)}
                        />
                      </div>
                      <Textarea
                        placeholder="Describe this milestone"
                        value={milestone.description}
                        onChange={(e) => updateMilestone(milestone.id, "description", e.target.value)}
                        rows={2}
                      />
                      <div className="flex items-center gap-3">
                        <Label className="text-sm whitespace-nowrap">Funding %:</Label>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={milestone.fundingPercentage}
                          onChange={(e) =>
                            updateMilestone(milestone.id, "fundingPercentage", Number.parseInt(e.target.value) || 0)
                          }
                          className="w-24"
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMilestone(milestone.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
              <Button variant="outline" onClick={addMilestone} className="w-full bg-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Add Milestone
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        {currentStep < STEPS.length ? (
          <Button onClick={() => setCurrentStep(Math.min(STEPS.length, currentStep + 1))}>
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="bg-success hover:bg-success/90 text-success-foreground">
            <Check className="w-4 h-4 mr-2" />
            Save Project
          </Button>
        )}
      </div>
    </div>
  )
}

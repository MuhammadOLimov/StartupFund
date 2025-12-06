// Mock data for StartupFund platform

export interface User {
  id: string
  email: string
  name: string
  role: "investor" | "entrepreneur"
  avatar?: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  avatar: string
  linkedin?: string
}

export interface Milestone {
  id: string
  title: string
  description: string
  targetDate: string
  status: "completed" | "in_progress" | "upcoming"
  fundingPercentage: number
}

export interface Startup {
  id: string
  name: string
  tagline: string
  pitch: string
  description: string
  industry: string
  stage: "pre_seed" | "seed" | "series_a" | "series_b"
  fundingGoal: number
  fundingRaised: number
  equityOffered: number
  valuation: number
  tam: number
  sam: number
  som: number
  heroImage: string
  videoUrl?: string
  team: TeamMember[]
  milestones: Milestone[]
  documents: { name: string; url: string }[]
  matchPercentage?: number
  viewerCount: number
  investorInterests: { id: string; name: string; avatar: string; viewedAt: string }[]
}

export interface Investment {
  id: string
  startupId: string
  startupName: string
  amount: number
  roiStrategy: "equity" | "convertible_note" | "revenue_share" | "safe"
  date: string
  status: "pending" | "accepted" | "rejected"
  currentValue: number
}

export const mockStartups: Startup[] = [
  {
    id: "1",
    name: "NeuralFlow AI",
    tagline: "Enterprise AI that thinks like your best employee",
    pitch: "We automate complex business workflows using advanced AI agents, reducing operational costs by 60%.",
    description:
      "NeuralFlow AI is revolutionizing enterprise automation with our proprietary AI agent technology. Our platform understands context, learns from interactions, and executes complex multi-step workflows autonomously. Fortune 500 companies are already seeing 60% reduction in operational costs.",
    industry: "Artificial Intelligence",
    stage: "seed",
    fundingGoal: 2500000,
    fundingRaised: 1625000,
    equityOffered: 15,
    valuation: 16000000,
    tam: 50000000000,
    sam: 5000000000,
    som: 500000000,
    heroImage: "/futuristic-ai-neural-network-abstract.jpg",
    videoUrl: "https://example.com/pitch.mp4",
    team: [
      {
        id: "1",
        name: "Sarah Chen",
        role: "CEO & Co-Founder",
        bio: "Ex-Google AI, Stanford PhD in Machine Learning",
        avatar: "/professional-woman-headshot.png",
        linkedin: "https://linkedin.com",
      },
      {
        id: "2",
        name: "Marcus Johnson",
        role: "CTO & Co-Founder",
        bio: "Former Principal Engineer at Meta AI Research",
        avatar: "/professional-man-headshot.png",
        linkedin: "https://linkedin.com",
      },
      {
        id: "3",
        name: "Emily Rodriguez",
        role: "VP of Product",
        bio: "10+ years in enterprise SaaS, ex-Salesforce",
        avatar: "/professional-woman-executive-headshot.png",
      },
    ],
    milestones: [
      {
        id: "1",
        title: "MVP Launch",
        description: "Launch core AI agent platform",
        targetDate: "2024-01-15",
        status: "completed",
        fundingPercentage: 20,
      },
      {
        id: "2",
        title: "First Enterprise Client",
        description: "Secure first Fortune 500 customer",
        targetDate: "2024-04-01",
        status: "completed",
        fundingPercentage: 25,
      },
      {
        id: "3",
        title: "Series A Ready",
        description: "$1M ARR milestone",
        targetDate: "2024-09-01",
        status: "in_progress",
        fundingPercentage: 35,
      },
      {
        id: "4",
        title: "Global Expansion",
        description: "Launch in EU and APAC markets",
        targetDate: "2025-03-01",
        status: "upcoming",
        fundingPercentage: 20,
      },
    ],
    documents: [
      { name: "Pitch Deck Q4 2024", url: "#" },
      { name: "Financial Projections", url: "#" },
      { name: "Technical Whitepaper", url: "#" },
    ],
    matchPercentage: 94,
    viewerCount: 234,
    investorInterests: [
      { id: "1", name: "Alex Thompson", avatar: "/investor-man.jpg", viewedAt: "2 hours ago" },
      { id: "2", name: "Jennifer Wu", avatar: "/investor-woman.jpg", viewedAt: "5 hours ago" },
    ],
  },
  {
    id: "2",
    name: "GreenCharge",
    tagline: "Smart EV charging infrastructure for the future",
    pitch: "Building the largest network of AI-optimized EV charging stations.",
    description:
      "GreenCharge is building next-generation EV charging infrastructure using AI to optimize charging schedules, reduce grid strain, and provide the fastest charging experience.",
    industry: "CleanTech",
    stage: "series_a",
    fundingGoal: 10000000,
    fundingRaised: 7500000,
    equityOffered: 12,
    valuation: 80000000,
    tam: 100000000000,
    sam: 15000000000,
    som: 1500000000,
    heroImage: "/modern-ev-charging.png",
    team: [
      {
        id: "1",
        name: "David Park",
        role: "CEO",
        bio: "Former Tesla Supercharger team lead",
        avatar: "/asian-professional-man.png",
      },
      {
        id: "2",
        name: "Lisa Martinez",
        role: "COO",
        bio: "Ex-McKinsey, energy sector specialist",
        avatar: "/latina-executive-woman.png",
      },
    ],
    milestones: [
      {
        id: "1",
        title: "100 Stations",
        description: "Deploy 100 charging stations",
        targetDate: "2024-06-01",
        status: "completed",
        fundingPercentage: 30,
      },
      {
        id: "2",
        title: "Grid Partnership",
        description: "Sign deal with major utility",
        targetDate: "2024-12-01",
        status: "in_progress",
        fundingPercentage: 40,
      },
      {
        id: "3",
        title: "500 Stations",
        description: "Scale to 500 locations",
        targetDate: "2025-06-01",
        status: "upcoming",
        fundingPercentage: 30,
      },
    ],
    documents: [
      { name: "Investor Deck", url: "#" },
      { name: "Market Analysis", url: "#" },
    ],
    matchPercentage: 87,
    viewerCount: 156,
    investorInterests: [],
  },
  {
    id: "3",
    name: "MediSync",
    tagline: "Connecting healthcare providers seamlessly",
    pitch: "Unified healthcare data platform reducing administrative burden by 80%.",
    description:
      "MediSync creates a seamless bridge between healthcare providers, insurers, and patients through our HIPAA-compliant data synchronization platform.",
    industry: "HealthTech",
    stage: "seed",
    fundingGoal: 3000000,
    fundingRaised: 900000,
    equityOffered: 18,
    valuation: 12000000,
    tam: 75000000000,
    sam: 8000000000,
    som: 400000000,
    heroImage: "/healthcare-technology-medical-interface.jpg",
    team: [
      {
        id: "1",
        name: "Dr. Amanda Foster",
        role: "CEO",
        bio: "Former Chief Medical Officer, 15 years in healthcare IT",
        avatar: "/woman-doctor-professional.jpg",
      },
      {
        id: "2",
        name: "Robert Kim",
        role: "CTO",
        bio: "Built Epic Systems integration layer",
        avatar: "/korean-man-tech-professional.jpg",
      },
    ],
    milestones: [
      {
        id: "1",
        title: "HIPAA Certification",
        description: "Complete security certifications",
        targetDate: "2024-03-01",
        status: "completed",
        fundingPercentage: 25,
      },
      {
        id: "2",
        title: "Hospital Pilot",
        description: "Launch pilot with 3 hospitals",
        targetDate: "2024-08-01",
        status: "in_progress",
        fundingPercentage: 50,
      },
      {
        id: "3",
        title: "Insurance Integration",
        description: "Partner with major insurers",
        targetDate: "2025-02-01",
        status: "upcoming",
        fundingPercentage: 25,
      },
    ],
    documents: [
      { name: "HIPAA Compliance Report", url: "#" },
      { name: "Product Demo", url: "#" },
    ],
    matchPercentage: 72,
    viewerCount: 89,
    investorInterests: [],
  },
  {
    id: "4",
    name: "FinLedger",
    tagline: "Blockchain-powered financial reconciliation",
    pitch: "Enterprise financial reconciliation in seconds, not days.",
    description:
      "FinLedger uses distributed ledger technology to provide instant, tamper-proof financial reconciliation for enterprises and financial institutions.",
    industry: "FinTech",
    stage: "pre_seed",
    fundingGoal: 1000000,
    fundingRaised: 350000,
    equityOffered: 20,
    valuation: 4000000,
    tam: 30000000000,
    sam: 3000000000,
    som: 150000000,
    heroImage: "/blockchain-financial-technology-abstract.jpg",
    team: [
      {
        id: "1",
        name: "James Wright",
        role: "CEO",
        bio: "Former Goldman Sachs blockchain division",
        avatar: "/businessman-finance-professional.jpg",
      },
    ],
    milestones: [
      {
        id: "1",
        title: "Protocol Launch",
        description: "Launch core reconciliation protocol",
        targetDate: "2024-09-01",
        status: "in_progress",
        fundingPercentage: 60,
      },
      {
        id: "2",
        title: "Bank Pilot",
        description: "Partner with regional bank",
        targetDate: "2025-03-01",
        status: "upcoming",
        fundingPercentage: 40,
      },
    ],
    documents: [{ name: "Technical Architecture", url: "#" }],
    matchPercentage: 68,
    viewerCount: 45,
    investorInterests: [],
  },
]

export const mockInvestments: Investment[] = [
  {
    id: "1",
    startupId: "1",
    startupName: "NeuralFlow AI",
    amount: 50000,
    roiStrategy: "equity",
    date: "2024-06-15",
    status: "accepted",
    currentValue: 62000,
  },
  {
    id: "2",
    startupId: "2",
    startupName: "GreenCharge",
    amount: 25000,
    roiStrategy: "convertible_note",
    date: "2024-08-20",
    status: "accepted",
    currentValue: 28500,
  },
  {
    id: "3",
    startupId: "3",
    startupName: "MediSync",
    amount: 15000,
    roiStrategy: "safe",
    date: "2024-10-05",
    status: "pending",
    currentValue: 15000,
  },
]

export const mockPortfolioHistory = [
  { month: "Jan", value: 50000 },
  { month: "Feb", value: 52000 },
  { month: "Mar", value: 55000 },
  { month: "Apr", value: 58000 },
  { month: "May", value: 72000 },
  { month: "Jun", value: 78000 },
  { month: "Jul", value: 85000 },
  { month: "Aug", value: 92000 },
  { month: "Sep", value: 98000 },
  { month: "Oct", value: 105500 },
]

export const industries = [
  "Artificial Intelligence",
  "CleanTech",
  "HealthTech",
  "FinTech",
  "EdTech",
  "E-Commerce",
  "SaaS",
]

export const stages = [
  { value: "pre_seed", label: "Pre-Seed" },
  { value: "seed", label: "Seed" },
  { value: "series_a", label: "Series A" },
  { value: "series_b", label: "Series B" },
]

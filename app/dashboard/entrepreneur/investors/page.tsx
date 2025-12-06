"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockStartups } from "@/lib/mock-data"
import { useI18n } from "@/lib/i18n"
import { Eye, MessageSquare, UserPlus, Clock } from "lucide-react"

export default function InvestorsPage() {
  const { t } = useI18n()
  const myStartup = mockStartups[0]

  // Mock additional investors data
  const allInvestors = [
    ...myStartup.investorInterests,
    { id: "3", name: "Michael Chen", avatar: "/investor-asian-man.jpg", viewedAt: "1 day ago", status: "viewed" },
    { id: "4", name: "Sarah Williams", avatar: "/investor-woman-2.jpg", viewedAt: "2 days ago", status: "interested" },
    { id: "5", name: "David Kim", avatar: "/investor-korean-man.jpg", viewedAt: "3 days ago", status: "contacted" },
  ]

  const interestedInvestors = allInvestors.filter((i) => i.status === "interested" || !i.status)
  const contactedInvestors = allInvestors.filter((i) => i.status === "contacted")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("dashboard.entrepreneur.recentViewers")}</h1>
        <p className="text-muted-foreground mt-1">Manage investor relationships</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
            <Eye className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{myStartup.viewerCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Interested</CardTitle>
            <UserPlus className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{interestedInvestors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Contacted</CardTitle>
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{contactedInvestors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Offers</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3</div>
          </CardContent>
        </Card>
      </div>

      {/* Investors List */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({allInvestors.length})</TabsTrigger>
          <TabsTrigger value="interested">Interested ({interestedInvestors.length})</TabsTrigger>
          <TabsTrigger value="contacted">Contacted ({contactedInvestors.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {allInvestors.map((investor) => (
                  <div key={investor.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={investor.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {investor.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{investor.name}</p>
                        <p className="text-sm text-muted-foreground">Viewed {investor.viewedAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{investor.status || "viewed"}</Badge>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interested" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {interestedInvestors.map((investor) => (
                  <div key={investor.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={investor.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {investor.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{investor.name}</p>
                        <p className="text-sm text-muted-foreground">Viewed {investor.viewedAt}</p>
                      </div>
                    </div>
                    <Button size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacted" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {contactedInvestors.length > 0 ? (
                  contactedInvestors.map((investor) => (
                    <div key={investor.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={investor.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {investor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{investor.name}</p>
                          <p className="text-sm text-muted-foreground">Contacted {investor.viewedAt}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Messages
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">No contacted investors yet</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

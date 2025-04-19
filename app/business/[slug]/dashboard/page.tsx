import type { Metadata } from "next"
import { getBusinessBySlug } from "@/lib/multi-tenant"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, CalendarDays, DollarSign, Users } from "lucide-react"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const business = await getBusinessBySlug(params.slug)

  if (!business) {
    return {
      title: "Dashboard Not Found",
      description: "The requested dashboard could not be found.",
    }
  }

  return {
    title: `Dashboard | ${business.name}`,
    description: `Business dashboard for ${business.name}`,
  }
}

export default async function DashboardPage({ params }: { params: { slug: string } }) {
  const business = await getBusinessBySlug(params.slug)

  if (!business) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to {business.name}. Here's an overview of your business.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">Scheduled this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 since last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 new services added</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>View your business performance metrics for the past 30 days.</CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] flex items-center justify-center bg-muted/20">
              <p className="text-muted-foreground">Chart visualization would appear here</p>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Appointments</CardTitle>
                <CardDescription>Your upcoming and recently completed appointments.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">Premium Detail Package</p>
                      <p className="text-sm text-muted-foreground">John Smith • 2023 Tesla Model 3</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Today, 2:00 PM</p>
                      <p className="text-xs text-muted-foreground">2 hours</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">Basic Wash & Wax</p>
                      <p className="text-sm text-muted-foreground">Sarah Johnson • 2020 BMW X5</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Tomorrow, 10:00 AM</p>
                      <p className="text-xs text-muted-foreground">1 hour</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Interior Deep Clean</p>
                      <p className="text-sm text-muted-foreground">Michael Brown • 2019 Ford F-150</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Tomorrow, 1:00 PM</p>
                      <p className="text-xs text-muted-foreground">3 hours</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
                <CardDescription>Personalized recommendations for your business.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-3">
                    <p className="text-sm">
                      Based on your customer data, offering a ceramic coating service could increase your revenue by
                      approximately 15%.
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-sm">
                      Your busiest days are Friday and Saturday. Consider offering a weekday discount to balance your
                      schedule.
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-sm">
                      Customers who book the Premium Detail Package are 70% more likely to return within 3 months.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Detailed analytics and metrics for your business.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center bg-muted/20">
              <p className="text-muted-foreground">Analytics content would appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and view business reports.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center bg-muted/20">
              <p className="text-muted-foreground">Reports content would appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>View and manage your notifications.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center bg-muted/20">
              <p className="text-muted-foreground">Notifications content would appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


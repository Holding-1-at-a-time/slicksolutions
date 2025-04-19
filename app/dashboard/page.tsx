import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRightIcon, BuildingIcon, CarIcon, ClipboardCheckIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Dashboard | Slick Solutions",
  description: "Your Slick Solutions dashboard",
}

export default function DashboardPage() {
  // Mock businesses
  const businesses = [
    {
      id: "1",
      name: "Premium Auto Detailing",
      slug: "premium-auto-detailing",
      logo: "/placeholder.svg?height=64&width=64",
      role: "owner",
    },
    {
      id: "2",
      name: "Luxury Car Spa",
      slug: "luxury-car-spa",
      logo: "/placeholder.svg?height=64&width=64",
      role: "member",
    },
  ]

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business) => (
          <Card key={business.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
                {business.logo ? (
                  <img src={business.logo || "/placeholder.svg"} alt={business.name} className="w-12 h-12" />
                ) : (
                  <BuildingIcon className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <CardTitle>{business.name}</CardTitle>
                <CardDescription>{business.role === "owner" ? "Business Owner" : "Team Member"}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                  <CarIcon className="w-5 h-5 mb-1 text-muted-foreground" />
                  <span className="text-xl font-bold">24</span>
                  <span className="text-xs text-muted-foreground">Vehicles</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                  <ClipboardCheckIcon className="w-5 h-5 mb-1 text-muted-foreground" />
                  <span className="text-xl font-bold">12</span>
                  <span className="text-xs text-muted-foreground">Appointments</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/business/${business.slug}/dashboard`}>
                  Go to Business
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle>Add New Business</CardTitle>
            <CardDescription>Create a new business profile</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
              <BuildingIcon className="w-8 h-8 text-muted-foreground/50" />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Create Business
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}


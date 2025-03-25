"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useConvexAuth } from "convex/react"
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BellIcon, MenuIcon, SearchIcon, SettingsIcon, UserIcon } from "lucide-react"
import BusinessSidebar from "./business-sidebar"

interface BusinessHeaderProps {
  business: any
}

export default function BusinessHeader({ business }: BusinessHeaderProps) {
  const { user } = useUser()
  const { isAuthenticated } = useConvexAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const userInitials =
    user?.firstName && user?.lastName ? `${user.firstName[0]}${user.lastName[0]}` : user?.firstName?.[0] || "U"

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <BusinessSidebar business={business} />
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          {business.logo ? (
            <Image
              src={business.logo || "/placeholder.svg"}
              alt={business.name}
              width={40}
              height={40}
              className="rounded-md"
            />
          ) : (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-lg"
              style={{ backgroundColor: business.primaryColor || "#00AE98" }}
            >
              {business.name[0]}
            </div>
          )}
          <span className="font-semibold hidden md:inline-block">{business.name}</span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <SearchIcon className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          <Button variant="ghost" size="icon">
            <BellIcon className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/business/${business.slug}/settings`}>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Business Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/sign-out")}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}


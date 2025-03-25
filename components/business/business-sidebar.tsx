"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChartIcon,
  CalendarIcon,
  CarIcon,
  ClipboardIcon,
  CreditCardIcon,
  HomeIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
  WrenchIcon,
} from "lucide-react"

interface BusinessSidebarProps {
  business: any
}

export default function BusinessSidebar({ business }: BusinessSidebarProps) {
  const pathname = usePathname()
  const slug = business.slug

  const routes = [
    {
      label: "Dashboard",
      icon: HomeIcon,
      href: `/business/${slug}/dashboard`,
      active: pathname === `/business/${slug}/dashboard`,
    },
    {
      label: "Appointments",
      icon: CalendarIcon,
      href: `/business/${slug}/appointments`,
      active: pathname === `/business/${slug}/appointments` || pathname.startsWith(`/business/${slug}/appointments/`),
    },
    {
      label: "Assessments",
      icon: SearchIcon,
      href: `/business/${slug}/assessments`,
      active: pathname === `/business/${slug}/assessments` || pathname.startsWith(`/business/${slug}/assessments/`),
    },
    {
      label: "Vehicles",
      icon: CarIcon,
      href: `/business/${slug}/vehicles`,
      active: pathname === `/business/${slug}/vehicles` || pathname.startsWith(`/business/${slug}/vehicles/`),
    },
    {
      label: "Services",
      icon: WrenchIcon,
      href: `/business/${slug}/services`,
      active: pathname === `/business/${slug}/services` || pathname.startsWith(`/business/${slug}/services/`),
    },
    {
      label: "Invoices",
      icon: ClipboardIcon,
      href: `/business/${slug}/invoices`,
      active: pathname === `/business/${slug}/invoices` || pathname.startsWith(`/business/${slug}/invoices/`),
    },
    {
      label: "Payments",
      icon: CreditCardIcon,
      href: `/business/${slug}/payments`,
      active: pathname === `/business/${slug}/payments` || pathname.startsWith(`/business/${slug}/payments/`),
    },
    {
      label: "Customers",
      icon: UsersIcon,
      href: `/business/${slug}/customers`,
      active: pathname === `/business/${slug}/customers` || pathname.startsWith(`/business/${slug}/customers/`),
    },
    {
      label: "Analytics",
      icon: BarChartIcon,
      href: `/business/${slug}/analytics`,
      active: pathname === `/business/${slug}/analytics` || pathname.startsWith(`/business/${slug}/analytics/`),
    },
    {
      label: "Settings",
      icon: SettingsIcon,
      href: `/business/${slug}/settings`,
      active: pathname === `/business/${slug}/settings` || pathname.startsWith(`/business/${slug}/settings/`),
    },
  ]

  return (
    <div className="flex h-full w-[240px] flex-col border-r">
      <ScrollArea className="flex-1">
        <div className="px-3 py-4">
          <div className="space-y-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={route.active ? "secondary" : "ghost"}
                className={cn("w-full justify-start", route.active && "bg-secondary/20")}
                asChild
              >
                <Link href={route.href}>
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}


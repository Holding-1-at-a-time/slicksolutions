"use client"

import type React from "react"
import { useState, useEffect } from "react"
import BusinessHeader from "@/components/business/business-header"
import BusinessSidebar from "@/components/business/business-sidebar"

interface BusinessProps {
  children: React.ReactNode
  params: { slug: string }
  business: any
}

export default function BusinessLayout({ children, params, business }: BusinessProps) {
  const [themeCSS, setThemeCSS] = useState("")

  useEffect(() => {
    // Generate theme CSS based on business colors
    const css = `
      :root {
        --primary: ${business.primaryColor || "#00AE98"};
        --primary-foreground: #ffffff;
        --secondary: ${business.secondaryColor || "#707070"};
        --secondary-foreground: #ffffff;
      }
    `
    setThemeCSS(css)
  }, [business])

  return (
    <div className="flex min-h-screen flex-col">
      <style jsx global>
        {themeCSS}
      </style>

      <BusinessHeader business={business} />

      <div className="flex flex-1">
        <div className="hidden md:block">
          <BusinessSidebar business={business} />
        </div>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}


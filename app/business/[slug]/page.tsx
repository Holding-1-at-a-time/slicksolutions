"use client"

import type React from "react"

import { auth } from "@clerk/nextjs"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import { userHasAccessToBusiness, generateThemeCSS } from "@/lib/multi-tenant"
import BusinessHeader from "@/components/business/business-header"
import BusinessSidebar from "@/components/business/business-sidebar"

interface Business {
  _id: string
  name: string
  slug: string
  logo: string
  primaryColor: string
  secondaryColor: string
}

interface Props {
  children: React.ReactNode
  params: { slug: string }
  business: Business
}

export default function BusinessLayout({ children, params, business }: Props) {
  const searchParams = useSearchParams()
  const [hasAccess, setHasAccess] = useState(false)
  const [themeCSS, setThemeCSS] = useState("")
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState("")

  useEffect(() => {
    setSlug(params.slug)
  }, [params.slug])

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { userId } = auth()

        if (!userId) {
          return notFound()
        }

        const access = await userHasAccessToBusiness(userId, business._id)

        if (!access) {
          return notFound()
        }

        setHasAccess(access)
      } catch (error) {
        console.error("Error checking access:", error)
        return notFound()
      } finally {
        setLoading(false)
      }
    }

    checkAccess()
  }, [business._id])

  useEffect(() => {
    const css = generateThemeCSS(business)
    setThemeCSS(css)
  }, [business])

  if (loading) {
    // This will be replaced by the loading.tsx component
    return null
  }

  if (!hasAccess) {
    return notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <style jsx global>
        {themeCSS}
      </style>

      <BusinessHeader business={business} />

      <div className="flex flex-1">
        <BusinessSidebar business={business} />

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}


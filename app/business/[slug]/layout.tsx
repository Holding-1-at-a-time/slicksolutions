import type React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getBusinessBySlug } from "@/lib/multi-tenant"
import BusinessLayout from "./page"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const business = await getBusinessBySlug(params.slug)

  if (!business) {
    return {
      title: "Business Not Found",
      description: "The requested business could not be found.",
    }
  }

  return {
    title: `${business.name} | Slick Solutions`,
    description: `${business.name} - Auto detailing services and management`,
  }
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  const business = await getBusinessBySlug(params.slug)

  if (!business) {
    return notFound()
  }

  return <BusinessLayout business={business} params={params} children={children} />
}


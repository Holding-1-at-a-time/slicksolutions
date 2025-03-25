"use client"

import type React from "react"

import { useUser } from "@clerk/nextjs"
import { useConvexAuth } from "convex/react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Spinner } from "@/components/ui/spinner"

interface ResourceGateProps {
  children: React.ReactNode
  resourceType: "invoice" | "appointment" | "assessment" | "vehicle"
  resourceId: Id<any>
  fallback?: React.ReactNode
}

export default function ResourceGate({ children, resourceType, resourceId, fallback }: ResourceGateProps) {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { user } = useUser()

  // Get the user's data from Convex
  const convexUser = useQuery(api.users.getByClerkId, user?.id ? { clerkId: user.id } : "skip")

  // Get the resource data based on type
  const resource = useQuery(
    resourceType === "invoice"
      ? api.invoices.get
      : resourceType === "appointment"
        ? api.appointments.get
        : resourceType === "assessment"
          ? api.assessments.get
          : api.vehicles.get,
    { id: resourceId },
  )

  // Show loading state while data is being fetched
  if (isLoading || (isAuthenticated && user && (convexUser === undefined || resource === undefined))) {
    return (
      <div className="flex justify-center items-center h-24">
        <Spinner />
      </div>
    )
  }

  // If not authenticated, user not found, or resource not found, show fallback
  if (!isAuthenticated || !user || !convexUser || !resource) {
    return fallback || null
  }

  // Check if the user has access to this resource
  let hasAccess = false

  // Admin users have access to all resources
  if (convexUser.role === "admin") {
    hasAccess = true
  }
  // Members have access to resources in their business
  else if (convexUser.role === "member") {
    hasAccess = resource.businessId === convexUser.businessId
  }
  // Clients have access to their own resources
  else if (convexUser.role === "client") {
    hasAccess = resource.userId === convexUser._id
  }

  if (!hasAccess) {
    return fallback || null
  }

  // User has access to this resource, show the children
  return <>{children}</>
}


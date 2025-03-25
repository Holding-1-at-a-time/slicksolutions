"use client"

import type React from "react"

import { useUser } from "@clerk/nextjs"
import { useConvexAuth } from "convex/react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Spinner } from "@/components/ui/spinner"

interface BusinessGateProps {
  children: React.ReactNode
  businessId: Id<"businesses">
  fallback?: React.ReactNode
}

export default function BusinessGate({ children, businessId, fallback }: BusinessGateProps) {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { user } = useUser()

  // Get the user's data from Convex
  const convexUser = useQuery(api.users.getByClerkId, user?.id ? { clerkId: user.id } : "skip")

  // Show loading state while authentication is in progress
  if (isLoading || (isAuthenticated && user && convexUser === undefined)) {
    return (
      <div className="flex justify-center items-center h-24">
        <Spinner />
      </div>
    )
  }

  // If not authenticated or user not found, show fallback
  if (!isAuthenticated || !user || !convexUser) {
    return fallback || null
  }

  // Check if the user has access to this business
  const hasAcc
  return fallback || null

  // Check if the user has access to this business
  const hasAccess = convexUser.role === "admin" || convexUser.businessId === businessId

  if (!hasAccess) {
    return fallback || null
  }

  // User has access to this business, show the children
  return <>{children}</>
}


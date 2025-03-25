"use client"

import type React from "react"

import { useUser } from "@clerk/nextjs"
import { useConvexAuth } from "convex/react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Spinner } from "@/components/ui/spinner"

interface RoleGateProps {
  children: React.ReactNode
  allowedRoles: string[]
  fallback?: React.ReactNode
}

export default function RoleGate({ children, allowedRoles, fallback }: RoleGateProps) {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { user } = useUser()

  // Get the user's role from Convex
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

  // Check if the user's role is allowed
  const hasRequiredRole = allowedRoles.includes(convexUser.role)

  if (!hasRequiredRole) {
    return fallback || null
  }

  // User has the required role, show the children
  return <>{children}</>
}


import { auth } from "@clerk/nextjs"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

// Get the current user's Convex user object
export async function getCurrentUser() {
  const { userId } = auth()

  if (!userId) {
    return null
  }

  try {
    return await convex.query(api.users.getByClerkId, { clerkId: userId })
  } catch (error) {
    console.error("Error fetching current user:", error)
    return null
  }
}

// Check if the current user has a specific role
export async function hasRole(role: string) {
  const user = await getCurrentUser()

  if (!user) {
    return false
  }

  return user.role === role
}

// Check if the current user is an admin
export async function isAdmin() {
  return hasRole("admin")
}

// Check if the current user is a member
export async function isMember() {
  return hasRole("member")
}

// Check if the current user is a client
export async function isClient() {
  return hasRole("client")
}

// Check if the current user has access to a specific business
export async function hasBusinessAccess(businessId: Id<"businesses">) {
  const user = await getCurrentUser()

  if (!user) {
    return false
  }

  // Admins have access to all businesses
  if (user.role === "admin") {
    return true
  }

  // Members and clients only have access to their associated business
  return user.businessId === businessId
}

// Check if the current user has access to a specific resource
export async function hasResourceAccess(resourceType: string, resourceId: string) {
  const user = await getCurrentUser()

  if (!user) {
    return false
  }

  // Admins have access to all resources
  if (user.role === "admin") {
    return true
  }

  try {
    switch (resourceType) {
      case "invoice":
        const invoice = await convex.query(api.invoices.get, { id: resourceId as Id<"invoices"> })
        return invoice && (invoice.userId === user._id || invoice.businessId === user.businessId)

      case "appointment":
        const appointment = await convex.query(api.appointments.get, { id: resourceId as Id<"appointments"> })
        return appointment && (appointment.userId === user._id || appointment.businessId === user.businessId)

      case "assessment":
        const assessment = await convex.query(api.assessments.get, { id: resourceId as Id<"assessments"> })
        return assessment && (assessment.userId === user._id || assessment.businessId === user.businessId)

      case "vehicle":
        const vehicle = await convex.query(api.vehicles.get, { id: resourceId as Id<"vehicles"> })
        return vehicle && (vehicle.userId === user._id || vehicle.businessId === user.businessId)

      default:
        return false
    }
  } catch (error) {
    console.error(`Error checking access to ${resourceType} ${resourceId}:`, error)
    return false
  }
}

// Get the permissions for the current user
export async function getUserPermissions() {
  const user = await getCurrentUser()

  if (!user) {
    return {
      canCreateBusiness: false,
      canManageUsers: false,
      canManageServices: false,
      canManageAppointments: false,
      canManageInvoices: false,
      canViewAnalytics: false,
      canProcessPayments: false,
    }
  }

  switch (user.role) {
    case "admin":
      return {
        canCreateBusiness: true,
        canManageUsers: true,
        canManageServices: true,
        canManageAppointments: true,
        canManageInvoices: true,
        canViewAnalytics: true,
        canProcessPayments: true,
      }

    case "member":
      return {
        canCreateBusiness: false,
        canManageUsers: false,
        canManageServices: true,
        canManageAppointments: true,
        canManageInvoices: true,
        canViewAnalytics: true,
        canProcessPayments: true,
      }

    case "client":
      return {
        canCreateBusiness: false,
        canManageUsers: false,
        canManageServices: false,
        canManageAppointments: false,
        canManageInvoices: false,
        canViewAnalytics: false,
        canProcessPayments: false,
      }

    default:
      return {
        canCreateBusiness: false,
        canManageUsers: false,
        canManageServices: false,
        canManageAppointments: false,
        canManageInvoices: false,
        canViewAnalytics: false,
        canProcessPayments: false,
      }
  }
}


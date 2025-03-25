import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

// Get business by ID
export async function getBusinessById(id: Id<"businesses">) {
  try {
    return await convex.query(api.businesses.get, { id })
  } catch (error) {
    console.error("Error fetching business by ID:", error)
    return null
  }
}

// Get business by slug
export async function getBusinessBySlug(slug: string) {
  try {
    return await convex.query(api.businesses.getBySlug, { slug })
  } catch (error) {
    console.error("Error fetching business by slug:", error)
    return null
  }
}

// Get user's business
export async function getUserBusiness(userId: string) {
  try {
    const user = await convex.query(api.users.getByClerkId, { clerkId: userId })
    if (!user || !user.businessId) {
      return null
    }

    return await convex.query(api.businesses.get, { id: user.businessId })
  } catch (error) {
    console.error("Error fetching user's business:", error)
    return null
  }
}

// Check if user has access to business
export async function userHasAccessToBusiness(userId: string, businessId: Id<"businesses">) {
  try {
    const user = await convex.query(api.users.getByClerkId, { clerkId: userId })
    if (!user) {
      return false
    }

    // Admin users have access to all businesses
    if (user.role === "admin") {
      return true
    }

    // Check if user is associated with this business
    return user.businessId === businessId
  } catch (error) {
    console.error("Error checking user access to business:", error)
    return false
  }
}

// Get business theme
export function getBusinessTheme(business: any) {
  if (!business) {
    return {
      primaryColor: "#00AE98",
      secondaryColor: "#707070",
      logo: null,
    }
  }

  return {
    primaryColor: business.primaryColor || "#00AE98",
    secondaryColor: business.secondaryColor || "#707070",
    logo: business.logo || null,
  }
}

// Generate CSS variables for business theme
export function generateThemeCSS(business: any) {
  const theme = getBusinessTheme(business)

  return `
    :root {
      --primary: ${theme.primaryColor};
      --primary-foreground: #ffffff;
      --secondary: ${theme.secondaryColor};
      --secondary-foreground: #ffffff;
    }
  `
}


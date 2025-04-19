import { ConvexHttpClient } from "./convex-mock"
import type { Id } from "@/convex/_generated/dataModel"

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "")

// Get business by ID
export async function getBusinessById(id: Id<"businesses">) {
  try {
    // Return mock data for development/preview
    return {
      _id: id,
      name: "Mock Business",
      slug: "mock-business",
      logo: "/placeholder.svg?height=40&width=40",
      primaryColor: "#00AE98",
      secondaryColor: "#707070",
      email: "mock@example.com",
      requireDeposit: true,
      depositPercentage: 20,
    }
  } catch (error) {
    console.error("Error fetching business by ID:", error)
    return null
  }
}

// Get business by slug
export async function getBusinessBySlug(slug: string) {
  try {
    // Return mock data for development/preview
    return {
      _id: "mock-business-id" as Id<"businesses">,
      name: "Mock Business",
      slug: slug,
      logo: "/placeholder.svg?height=40&width=40",
      primaryColor: "#00AE98",
      secondaryColor: "#707070",
      email: "mock@example.com",
      requireDeposit: true,
      depositPercentage: 20,
    }
  } catch (error) {
    console.error("Error fetching business by slug:", error)
    return null
  }
}

// Get user's business
export async function getUserBusiness(userId: string) {
  try {
    // Return mock data for development/preview
    return {
      _id: "mock-business-id" as Id<"businesses">,
      name: "Mock Business",
      slug: "mock-business",
      logo: "/placeholder.svg?height=40&width=40",
      primaryColor: "#00AE98",
      secondaryColor: "#707070",
      email: "mock@example.com",
      requireDeposit: true,
      depositPercentage: 20,
    }
  } catch (error) {
    console.error("Error fetching user's business:", error)
    return null
  }
}

// Check if user has access to business
export async function userHasAccessToBusiness(userId: string, businessId: Id<"businesses">) {
  try {
    // For development/preview, always return true
    return true
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


import { clerkMiddleware, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export default clerkMiddleware({
  publicRoutes: [
    "/",
    "/api/webhook/clerk",
    "/api/webhook/stripe",
    "/pricing",
    "/about",
    "/contact",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/uploadthing",
  ],
  async afterAuth(auth, req) {
    // If the user is logged in and trying to access a protected route
    if (auth.userId && !auth.isPublicRoute) {
      try {
        // Get the user from Clerk
        const user = await clerkClient.users.getUser(auth.userId)

        // Check if the user has completed onboarding
        const hasCompletedOnboarding = user.publicMetadata.hasCompletedOnboarding

        // If the user hasn't completed onboarding and isn't on the onboarding page, redirect them
        if (
          !hasCompletedOnboarding &&
          !req.nextUrl.pathname.startsWith("/onboarding") &&
          !req.nextUrl.pathname.startsWith("/api/")
        ) {
          const onboardingUrl = new URL("/onboarding", req.url)
          return NextResponse.redirect(onboardingUrl)
        }

        // Handle tenant-specific routes
        if (req.nextUrl.pathname.startsWith("/business/")) {
          // Extract business slug from URL
          const slug = req.nextUrl.pathname.split("/")[2]

          // Check if the user has access to this business
          // This would typically involve checking the user's role and business association
          // For now, we'll just check if the user has a businessSlug in their metadata
          const userBusinessSlug = user.publicMetadata.businessSlug

          if (userBusinessSlug !== slug && user.publicMetadata.role !== "admin") {
            // Redirect to the user's business or dashboard if they don't have access
            if (userBusinessSlug) {
              const businessUrl = new URL(`/business/${userBusinessSlug}`, req.url)
              return NextResponse.redirect(businessUrl)
            } else {
              const dashboardUrl = new URL("/dashboard", req.url)
              return NextResponse.redirect(dashboardUrl)
            }
          }
        }
      } catch (error) {
        console.error("Error in middleware:", error)
        // Continue the request even if there's an error
      }
    }

    return NextResponse.next()
  },
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}


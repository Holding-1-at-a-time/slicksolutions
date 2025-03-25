import type { Metadata } from "next"
import { auth, currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { ConvexHttpClient } from "convex/browser"
import OnboardingForm from "@/components/onboarding/onboarding-form"

export const metadata: Metadata = {
  title: "Onboarding | Slick Solutions",
  description: "Complete your onboarding to get started with Slick Solutions",
}

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export default async function OnboardingPage() {
  const { userId } = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // Get the current user from Clerk
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  // Check if the user has already completed onboarding
  if (user.publicMetadata.hasCompletedOnboarding) {
    // If they have a business, redirect to their business dashboard
    if (user.publicMetadata.businessSlug) {
      redirect(`/business/${user.publicMetadata.businessSlug}/dashboard`)
    }

    // Otherwise, redirect to the main dashboard
    redirect("/dashboard")
  }

  // Get the user's role from Clerk metadata
  const role = (user.publicMetadata.role as string) || "client"

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <OnboardingForm initialRole={role} />
        </div>
      </main>
    </div>
  )
}


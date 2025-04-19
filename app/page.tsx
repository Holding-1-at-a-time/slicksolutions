import { redirect } from "next/navigation"

export default function Home() {
  // In a real implementation, we would check if the user is authenticated
  // and has completed onboarding
  const isAuthenticated = true
  const hasCompletedOnboarding = true

  if (isAuthenticated) {
    if (hasCompletedOnboarding) {
      redirect("/dashboard")
    } else {
      redirect("/onboarding")
    }
  }

  // If not authenticated, redirect to sign-in
  redirect("/sign-in")
}


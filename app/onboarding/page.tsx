import type { Metadata } from "next"
import OnboardingForm from "@/components/onboarding/onboarding-form"

export const metadata: Metadata = {
  title: "Onboarding | Slick Solutions",
  description: "Complete your onboarding to get started with Slick Solutions",
}

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <OnboardingForm initialRole="client" />
        </div>
      </main>
    </div>
  )
}


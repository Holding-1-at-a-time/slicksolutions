"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useConvexAuth } from "convex/react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import { CheckIcon, ChevronRightIcon, StoreIcon, UserIcon } from "lucide-react"
import type { Id } from "@/convex/_generated/dataModel"

interface OnboardingFormProps {
  initialRole?: string
}

export default function OnboardingForm({ initialRole = "client" }: OnboardingFormProps) {
  const { user, isLoaded: isUserLoaded } = useUser()
  const { isAuthenticated } = useConvexAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [activeStep, setActiveStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [role, setRole] = useState(initialRole)
  const [businessName, setBusinessName] = useState("")
  const [businessEmail, setBusinessEmail] = useState("")
  const [businessPhone, setBusinessPhone] = useState("")
  const [businessAddress, setBusinessAddress] = useState("")
  const [businessWebsite, setBusinessWebsite] = useState("")
  const [businessDescription, setBusinessDescription] = useState("")
  const [primaryColor, setPrimaryColor] = useState("#00AE98")
  const [secondaryColor, setSecondaryColor] = useState("#707070")
  const [requireDeposit, setRequireDeposit] = useState(true)
  const [depositPercentage, setDepositPercentage] = useState(20)

  // Personal info
  const [name, setName] = useState(user?.fullName || "")
  const [phone, setPhone] = useState("")

  // Convex mutations
  const createBusiness = useMutation(api.businesses.create)
  const createUser = useMutation(api.users.create)
  const updateUser = useMutation(api.users.update)

  // Handle step navigation
  const nextStep = () => {
    if (activeStep === 0 && role === "client") {
      // Skip business info for clients
      setActiveStep(2)
    } else {
      setActiveStep(activeStep + 1)
    }
  }

  const prevStep = () => {
    if (activeStep === 2 && role === "client") {
      // Skip business info for clients
      setActiveStep(0)
    } else {
      setActiveStep(activeStep - 1)
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete onboarding.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create or update user in Convex
      let businessId

      // If the user is a business owner or member, create a business
      if (role === "business_owner" || role === "member") {
        // Generate a slug from the business name
        const slug = businessName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")

        // Create the business
        businessId = await createBusiness({
          name: businessName,
          email: businessEmail,
          phone: businessPhone,
          address: businessAddress,
          website: businessWebsite,
          description: businessDescription,
          primaryColor,
          secondaryColor,
          requireDeposit,
          depositPercentage,
          slug,
        })

        // Update user metadata in Clerk
        await user.update({
          publicMetadata: {
            role,
            businessId: businessId,
            businessSlug: slug,
            hasCompletedOnboarding: true,
          },
        })
      } else {
        // For clients, just update their role
        await user.update({
          publicMetadata: {
            role: "client",
            hasCompletedOnboarding: true,
          },
        })
      }

      // Check if the user already exists in Convex
      interface UserCheckResponse {
        exists: boolean
        id?: Id<"users">
        error?: string
      }

      const existingUser: UserCheckResponse = await fetch(`/api/users/check?clerkId=${user.id}`).then((res) =>
        res.json(),
      )

      if (existingUser && existingUser.exists) {
        // Update the existing user
        await updateUser({
          id: existingUser.id,
          name,
          phone,
          role,
          businessId,
        })
      } else {
        // Create a new user
        await createUser({
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
          name,
          phone,
          role,
          businessId,
        })
      }

      toast({
        title: "Onboarding complete",
        description: "Your account has been set up successfully.",
      })

      // Redirect based on role
      if (role === "business_owner" || role === "member") {
        const slug = businessName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
        router.push(`/business/${slug}/dashboard`)
      } else {
        router.push("/dashboard")
      }

      router.refresh()
    } catch (error) {
      console.error("Error during onboarding:", error)
      toast({
        title: "Onboarding failed",
        description: "There was an error setting up your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render loading state
  if (!isUserLoaded || !isAuthenticated) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <Spinner />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Welcome to Slick Solutions</CardTitle>
        <CardDescription>
          Complete your profile to get started with our auto detailing management platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${activeStep >= 0 ? "bg-primary text-primary-foreground" : "border border-muted-foreground/30 text-muted-foreground"}`}
              >
                {activeStep > 0 ? <CheckIcon className="h-4 w-4" /> : 1}
              </div>
              <div className="ml-2 text-sm font-medium">Account Type</div>
            </div>
            <div className="hidden sm:block flex-1 mx-4 h-px bg-muted-foreground/30"></div>
            <div className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${activeStep >= 1 ? "bg-primary text-primary-foreground" : "border border-muted-foreground/30 text-muted-foreground"}`}
              >
                {activeStep > 1 ? <CheckIcon className="h-4 w-4" /> : 2}
              </div>
              <div className="ml-2 text-sm font-medium">Business Details</div>
            </div>
            <div className="hidden sm:block flex-1 mx-4 h-px bg-muted-foreground/30"></div>
            <div className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${activeStep >= 2 ? "bg-primary text-primary-foreground" : "border border-muted-foreground/30 text-muted-foreground"}`}
              >
                {activeStep > 2 ? <CheckIcon className="h-4 w-4" /> : 3}
              </div>
              <div className="ml-2 text-sm font-medium">Personal Info</div>
            </div>
          </div>
        </div>

        {activeStep === 0 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">What best describes you?</h3>
              <RadioGroup value={role} onValueChange={setRole} className="space-y-4">
                <div
                  className="flex items-start space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => setRole("business_owner")}
                >
                  <RadioGroupItem value="business_owner" id="business_owner" className="mt-1" />
                  <div className="space-y-1">
                    <Label htmlFor="business_owner" className="text-base font-medium cursor-pointer">
                      <StoreIcon className="h-5 w-5 inline-block mr-2" />
                      Business Owner
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      I own an auto detailing business and want to manage my operations.
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-start space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => setRole("member")}
                >
                  <RadioGroupItem value="member" id="member" className="mt-1" />
                  <div className="space-y-1">
                    <Label htmlFor="member" className="text-base font-medium cursor-pointer">
                      <UserIcon className="h-5 w-5 inline-block mr-2" />
                      Team Member
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      I work for an auto detailing business and need to manage appointments and assessments.
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-start space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => setRole("client")}
                >
                  <RadioGroupItem value="client" id="client" className="mt-1" />
                  <div className="space-y-1">
                    <Label htmlFor="client" className="text-base font-medium cursor-pointer">
                      <UserIcon className="h-5 w-5 inline-block mr-2" />
                      Client
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      I'm a customer looking to book auto detailing services.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {activeStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Premium Auto Detailing"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email *</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    placeholder="contact@premiumdetailing.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input
                    id="businessPhone"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessWebsite">Business Website</Label>
                  <Input
                    id="businessWebsite"
                    value={businessWebsite}
                    onChange={(e) => setBusinessWebsite(e.target.value)}
                    placeholder="https://premiumdetailing.com"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Input
                    id="businessAddress"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    placeholder="123 Main St, Anytown, USA"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="businessDescription">Business Description</Label>
                  <Textarea
                    id="businessDescription"
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    placeholder="Tell us about your business..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Business Settings</h3>
              <Tabs defaultValue="branding" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="branding">Branding</TabsTrigger>
                  <TabsTrigger value="payments">Payments</TabsTrigger>
                </TabsList>

                <TabsContent value="branding">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: primaryColor }} />
                        <Input
                          id="primaryColor"
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-16 h-8 p-1"
                        />
                        <Input
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: secondaryColor }} />
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="w-16 h-8 p-1"
                        />
                        <Input
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="payments">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="requireDeposit">Require Deposit</Label>
                        <p className="text-sm text-muted-foreground">
                          Require clients to pay a deposit when booking services
                        </p>
                      </div>
                      <Switch id="requireDeposit" checked={requireDeposit} onCheckedChange={setRequireDeposit} />
                    </div>

                    {requireDeposit && (
                      <div className="space-y-2">
                        <Label htmlFor="depositPercentage">Deposit Percentage</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="depositPercentage"
                            type="number"
                            min={1}
                            max={100}
                            value={depositPercentage}
                            onChange={(e) => setDepositPercentage(Number.parseInt(e.target.value))}
                            className="w-24"
                          />
                          <span>%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.primaryEmailAddress?.emailAddress || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {activeStep > 0 ? (
          <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
            Back
          </Button>
        ) : (
          <div></div>
        )}

        {activeStep < 2 ? (
          <Button
            onClick={nextStep}
            disabled={
              isSubmitting || (activeStep === 0 && !role) || (activeStep === 1 && (!businessName || !businessEmail))
            }
          >
            Next
            <ChevronRightIcon className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting || !name}>
            {isSubmitting ? (
              <>
                <Spinner className="mr-2" />
                Completing Setup...
              </>
            ) : (
              "Complete Setup"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}


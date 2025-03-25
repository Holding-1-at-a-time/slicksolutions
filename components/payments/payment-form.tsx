"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useConvexAuth } from "convex/react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircleIcon, CreditCardIcon, DollarSignIcon } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"

// Load Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  invoiceId: Id<"invoices">
}

export default function PaymentForm({ invoiceId }: PaymentFormProps) {
  const { isAuthenticated } = useConvexAuth()
  const { toast } = useToast()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentType, setPaymentType] = useState<"full" | "deposit">("full")

  // Get invoice data
  const invoice = useQuery(api.invoices.get, { id: invoiceId })

  // Create payment intent when component mounts
  useEffect(() => {
    if (!isAuthenticated || !invoice) return

    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/payment/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            invoiceId,
            paymentType,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to create payment intent")
        }

        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (error) {
        console.error("Error creating payment intent:", error)
        toast({
          title: "Payment Error",
          description: error instanceof Error ? error.message : "Failed to create payment intent",
          variant: "destructive",
        })
      }
    }

    createPaymentIntent()
  }, [isAuthenticated, invoiceId, paymentType, toast, invoice])

  // Handle payment type change
  const handlePaymentTypeChange = (value: string) => {
    setPaymentType(value as "full" | "deposit")
  }

  if (!invoice) {
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

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>Pay for invoice #{invoice._id.toString().slice(-6)}</CardDescription>
      </CardHeader>
      <CardContent>
        {invoice.depositAmount && invoice.requireDeposit && !invoice.depositPaid ? (
          <Tabs defaultValue={paymentType} onValueChange={handlePaymentTypeChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="full">
                <DollarSignIcon className="h-4 w-4 mr-2" />
                Pay Full Amount
              </TabsTrigger>
              <TabsTrigger value="deposit">
                <CreditCardIcon className="h-4 w-4 mr-2" />
                Pay Deposit Only
              </TabsTrigger>
            </TabsList>

            <TabsContent value="full">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Pay the full invoice amount of ${invoice.total.toFixed(2)}.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="deposit">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Pay a deposit of ${invoice.depositAmount.toFixed(2)} to secure your appointment.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">Pay the full invoice amount of ${invoice.total.toFixed(2)}.</p>
          </div>
        )}

        {clientSecret ? (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm invoiceId={invoiceId} paymentType={paymentType} />
          </Elements>
        ) : (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface CheckoutFormProps {
  invoiceId: Id<"invoices">
  paymentType: "full" | "deposit"
}

function CheckoutForm({ invoiceId, paymentType }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/invoices/${invoiceId}/payment-success`,
        },
        redirect: "if_required",
      })

      if (error) {
        setErrorMessage(error.message || "An error occurred during payment")
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        })

        router.push(`/invoices/${invoiceId}/payment-success`)
        router.refresh()
      }
    } catch (error) {
      console.error("Payment error:", error)
      setErrorMessage("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />

      {errorMessage && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start gap-2">
          <AlertCircleIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      <Button type="submit" className="mt-4 w-full" disabled={!stripe || isLoading}>
        {isLoading ? (
          <>
            <Spinner className="mr-2" />
            Processing...
          </>
        ) : (
          <>Pay {paymentType === "deposit" ? "Deposit" : "Now"}</>
        )}
      </Button>
    </form>
  )
}


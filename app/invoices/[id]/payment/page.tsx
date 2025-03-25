import type { Metadata } from "next"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"
import PaymentForm from "@/components/payments/payment-form"
import InvoiceDetails from "@/components/invoices/invoice-details"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Pay Invoice | Slick Solutions",
  description: "Pay your auto detailing invoice",
}

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export default async function PayInvoicePage({ params }: { params: { id: string } }) {
  const { userId } = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // Get invoice data
  const invoice = await convex.query(api.invoices.get, { id: params.id })

  if (!invoice) {
    redirect("/invoices")
  }

  // Get user data
  const user = await convex.query(api.users.getByClerkId, { clerkId: userId })

  if (!user) {
    redirect("/onboarding")
  }

  // Verify user has access to this invoice
  if (invoice.userId !== user._id && user.businessId !== invoice.businessId) {
    redirect("/invoices")
  }

  // If invoice is already paid, redirect to invoice details
  if (invoice.status === "paid") {
    redirect(`/invoices/${params.id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" asChild className="mr-2">
          <Link href={`/invoices/${params.id}`}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Pay Invoice</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <InvoiceDetails invoice={invoice} />
        </div>

        <div>
          <PaymentForm invoiceId={invoice._id} />
        </div>
      </div>
    </div>
  )
}


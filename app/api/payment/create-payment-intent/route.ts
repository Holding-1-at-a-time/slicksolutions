import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import Stripe from "stripe"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const { invoiceId, paymentType } = await req.json()

    if (!invoiceId) {
      return NextResponse.json({ error: "Missing invoice ID" }, { status: 400 })
    }

    // Get invoice data
    const invoice = await convex.query(api.invoices.get, { id: invoiceId })
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    // Get user data
    const user = await convex.query(api.users.getByClerkId, { clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify user has access to this invoice
    if (invoice.userId !== user._id && user.businessId !== invoice.businessId) {
      return NextResponse.json({ error: "Unauthorized access to invoice" }, { status: 403 })
    }

    // Get business data
    const business = await convex.query(api.businesses.get, { id: invoice.businessId })
    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    // Calculate amount to charge
    let amount = 0
    if (paymentType === "deposit") {
      if (!invoice.depositAmount) {
        return NextResponse.json({ error: "No deposit amount set for this invoice" }, { status: 400 })
      }
      amount = invoice.depositAmount * 100 // Convert to cents
    } else {
      amount = invoice.total * 100 // Convert to cents
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: {
        invoiceId: invoice._id.toString(),
        businessId: business._id.toString(),
        userId: user._id.toString(),
        paymentType: paymentType || "full",
      },
      automatic_payment_methods: {
        enabled: true,
      },
      application_fee_amount: Math.round(amount * 0.05), // 5% platform fee
      transfer_data: business.stripeAccountId
        ? {
            destination: business.stripeAccountId,
          }
        : undefined,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}


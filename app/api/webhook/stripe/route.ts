import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
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
  const body = await req.text()
  const signature = headers().get("stripe-signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  try {
    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice)
        break

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error(`Error handling webhook: ${error}`)
    return NextResponse.json({ error: "Error handling webhook" }, { status: 500 })
  }
}

// Handle payment intent succeeded
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log("Payment intent succeeded:", paymentIntent.id)

  // Get the invoice ID from the payment intent metadata
  const invoiceId = paymentIntent.metadata.invoiceId
  const businessId = paymentIntent.metadata.businessId
  const userId = paymentIntent.metadata.userId
  const paymentType = paymentIntent.metadata.paymentType || "full"

  if (!invoiceId || !businessId || !userId) {
    console.error("Missing required metadata in payment intent")
    return
  }

  // Create a payment record in the database
  await convex.mutation(api.payments.create, {
    businessId,
    userId,
    invoiceId,
    amount: paymentIntent.amount / 100, // Convert from cents to dollars
    stripePaymentId: paymentIntent.id,
    status: "succeeded",
    type: paymentType,
  })

  // Update the invoice status
  if (paymentType === "deposit") {
    await convex.mutation(api.invoices.updateDepositPaid, {
      id: invoiceId,
      depositPaid: true,
    })
  } else {
    await convex.mutation(api.invoices.updateStatus, {
      id: invoiceId,
      status: "paid",
    })
  }
}

// Handle payment intent failed
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log("Payment intent failed:", paymentIntent.id)

  // Get the invoice ID from the payment intent metadata
  const invoiceId = paymentIntent.metadata.invoiceId
  const businessId = paymentIntent.metadata.businessId
  const userId = paymentIntent.metadata.userId

  if (!invoiceId || !businessId || !userId) {
    console.error("Missing required metadata in payment intent")
    return
  }

  // Create a payment record in the database
  await convex.mutation(api.payments.create, {
    businessId,
    userId,
    invoiceId,
    amount: paymentIntent.amount / 100, // Convert from cents to dollars
    stripePaymentId: paymentIntent.id,
    status: "failed",
    type: paymentIntent.metadata.paymentType || "full",
  })
}

// Handle invoice paid
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log("Invoice paid:", invoice.id)

  // Get the business ID from the invoice metadata
  const businessId = invoice.metadata.businessId

  if (!businessId) {
    console.error("Missing business ID in invoice metadata")
    return
  }

  // Update the business subscription status
  await convex.mutation(api.businesses.updateSubscription, {
    id: businessId,
    subscriptionStatus: "active",
    subscriptionTier: invoice.metadata.tier || "basic",
  })
}

// Handle invoice payment failed
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log("Invoice payment failed:", invoice.id)

  // Get the business ID from the invoice metadata
  const businessId = invoice.metadata.businessId

  if (!businessId) {
    console.error("Missing business ID in invoice metadata")
    return
  }

  // Update the business subscription status
  await convex.mutation(api.businesses.updateSubscription, {
    id: businessId,
    subscriptionStatus: "past_due",
  })
}

// Handle subscription created
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log("Subscription created:", subscription.id)

  // Get the business ID from the subscription metadata
  const businessId = subscription.metadata.businessId

  if (!businessId) {
    console.error("Missing business ID in subscription metadata")
    return
  }

  // Update the business subscription status
  await convex.mutation(api.businesses.updateSubscription, {
    id: businessId,
    subscriptionStatus: subscription.status,
    subscriptionTier: subscription.metadata.tier || "basic",
    stripeSubscriptionId: subscription.id,
  })
}

// Handle subscription updated
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("Subscription updated:", subscription.id)

  // Get the business ID from the subscription metadata
  const businessId = subscription.metadata.businessId

  if (!businessId) {
    console.error("Missing business ID in subscription metadata")
    return
  }

  // Update the business subscription status
  await convex.mutation(api.businesses.updateSubscription, {
    id: businessId,
    subscriptionStatus: subscription.status,
    subscriptionTier: subscription.metadata.tier || "basic",
  })
}

// Handle subscription deleted
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("Subscription deleted:", subscription.id)

  // Get the business ID from the subscription metadata
  const businessId = subscription.metadata.businessId

  if (!businessId) {
    console.error("Missing business ID in subscription metadata")
    return
  }

  // Update the business subscription status
  await convex.mutation(api.businesses.updateSubscription, {
    id: businessId,
    subscriptionStatus: "canceled",
  })
}


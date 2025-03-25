import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { Webhook } from "svix"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(req: NextRequest) {
  // Get the Clerk webhook signature
  const svix_id = headers().get("svix-id")
  const svix_timestamp = headers().get("svix-timestamp")
  const svix_signature = headers().get("svix-signature")

  // If there's no signature, return an error
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 })
  }

  // Get the body
  const body = await req.text()

  // Create a new Svix instance with the webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)

  let evt: any

  try {
    // Verify the webhook
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    })
  } catch (error) {
    console.error("Error verifying webhook:", error)
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 })
  }

  // Get the event type
  const eventType = evt.type

  // Handle the event
  try {
    switch (eventType) {
      case "user.created":
        await handleUserCreated(evt.data)
        break

      case "user.updated":
        await handleUserUpdated(evt.data)
        break

      case "user.deleted":
        await handleUserDeleted(evt.data)
        break

      default:
        console.log(`Unhandled event type: ${eventType}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error handling webhook: ${error}`)
    return NextResponse.json({ error: "Error handling webhook" }, { status: 500 })
  }
}

// Handle user created event
async function handleUserCreated(data: any) {
  console.log("User created:", data.id)

  // Check if user already exists in the database
  const existingUser = await convex.query(api.users.getByClerkId, {
    clerkId: data.id,
  })

  if (existingUser) {
    console.log("User already exists in the database")
    return
  }

  // Get user data
  const email = data.email_addresses[0]?.email_address
  const name = `${data.first_name || ""} ${data.last_name || ""}`.trim()

  if (!email) {
    console.error("User has no email address")
    return
  }

  // Determine user role
  // By default, new users are clients unless specified otherwise in public metadata
  const role = data.public_metadata?.role || "client"
  const businessId = data.public_metadata?.businessId

  // Create user in the database
  await convex.mutation(api.users.create, {
    clerkId: data.id,
    email,
    name,
    role,
    businessId,
  })
}

// Handle user updated event
async function handleUserUpdated(data: any) {
  console.log("User updated:", data.id)

  // Get user from the database
  const user = await convex.query(api.users.getByClerkId, {
    clerkId: data.id,
  })

  if (!user) {
    console.error("User not found in the database")
    return
  }

  // Get updated user data
  const email = data.email_addresses[0]?.email_address
  const name = `${data.first_name || ""} ${data.last_name || ""}`.trim()

  // Determine if role or business ID has changed
  const role = data.public_metadata?.role
  const businessId = data.public_metadata?.businessId

  // Update user in the database
  await convex.mutation(api.users.update, {
    id: user._id,
    email: email || undefined,
    name: name || undefined,
    role: role || undefined,
    businessId: businessId || undefined,
  })
}

// Handle user deleted event
async function handleUserDeleted(data: any) {
  console.log("User deleted:", data.id)

  // Get user from the database
  const user = await convex.query(api.users.getByClerkId, {
    clerkId: data.id,
  })

  if (!user) {
    console.error("User not found in the database")
    return
  }

  // Delete user from the database
  await convex.mutation(api.users.remove, {
    id: user._id,
  })
}


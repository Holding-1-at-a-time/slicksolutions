import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the Clerk ID from the query parameters
    const clerkId = req.nextUrl.searchParams.get("clerkId")

    if (!clerkId) {
      return NextResponse.json({ error: "Missing Clerk ID" }, { status: 400 })
    }

    // Only allow checking for the current user or by admins
    if (clerkId !== userId) {
      // Check if the current user is an admin
      const currentUser = await convex.query(api.users.getByClerkId, { clerkId: userId })
      if (!currentUser || currentUser.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized to check other users" }, { status: 403 })
      }
    }

    // Check if the user exists in Convex
    const user = await convex.query(api.users.getByClerkId, { clerkId })

    if (user) {
      return NextResponse.json({
        exists: true,
        id: user._id,
      })
    } else {
      return NextResponse.json({
        exists: false,
      })
    }
  } catch (error) {
    console.error("Error checking user:", error)
    return NextResponse.json({ error: "Failed to check user" }, { status: 500 })
  }
}


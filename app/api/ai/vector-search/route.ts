import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

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
    const { businessId, query, type, limit } = await req.json()

    if (!businessId || !query || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user data
    const user = await convex.query(api.users.getByClerkId, { clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify user has access to this business
    if (user.businessId !== businessId && user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access to business data" }, { status: 403 })
    }

    // Generate embedding for the query
    const { text: embeddingJson } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Generate an embedding vector for the following text: "${query}". Return only the embedding vector as a JSON array of numbers.`,
      system:
        "You are a tool that generates embedding vectors for text. Return only the embedding vector as a JSON array of numbers.",
    })

    let embedding
    try {
      // Parse the embedding from the response
      embedding = JSON.parse(embeddingJson)
      if (!Array.isArray(embedding) || !embedding.every((n) => typeof n === "number")) {
        throw new Error("Invalid embedding format")
      }
    } catch (error) {
      console.error("Error parsing embedding:", error)
      return NextResponse.json({ error: "Failed to generate valid embedding" }, { status: 500 })
    }

    // Perform vector search based on type
    let results
    switch (type) {
      case "services":
        results = await convex.query(api.vectorSearch.similarServices, {
          businessId,
          description: query,
          limit: limit || 5,
        })
        break
      case "vehicles":
        // Extract make, model, year from query if possible
        const vehicleMatch = query.match(/(\d{4})\s+([A-Za-z]+)\s+([A-Za-z0-9]+)/)
        if (vehicleMatch) {
          const [_, year, make, model] = vehicleMatch
          results = await convex.query(api.vectorSearch.similarVehicles, {
            businessId,
            make,
            model,
            year: Number.parseInt(year),
            limit: limit || 5,
          })
        } else {
          // If we can't parse the query, use the embedding directly
          results = await convex.query(api.vectorSearch.similarVehicles, {
            businessId,
            query,
            embedding,
            limit: limit || 5,
          })
        }
        break
      case "assessments":
        results = await convex.query(api.vectorSearch.similarAssessments, {
          businessId,
          description: query,
          limit: limit || 5,
        })
        break
      default:
        return NextResponse.json({ error: "Invalid search type" }, { status: 400 })
    }

    return NextResponse.json({
      results,
      query,
      type,
    })
  } catch (error) {
    console.error("Error performing vector search:", error)
    return NextResponse.json({ error: "Failed to perform vector search" }, { status: 500 })
  }
}


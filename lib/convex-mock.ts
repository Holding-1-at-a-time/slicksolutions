// Mock implementation of Convex client for development/preview

import type { Id } from "@/convex/_generated/dataModel"

export class ConvexHttpClient {
  constructor(url: string) {}

  async query(queryFunction: any, args: any): Promise<any> {
    // Return mock data based on the query function
    if (queryFunction.toString().includes("getByClerkId")) {
      return {
        _id: "mock-user-id" as Id<"users">,
        name: "Mock User",
        email: "mock@example.com",
        role: "client",
        businessId: "mock-business-id" as Id<"businesses">,
      }
    }

    if (queryFunction.toString().includes("get") && args.id) {
      return {
        _id: args.id,
        name: "Mock Item",
        status: "pending",
        total: 100,
        subtotal: 90,
        tax: 10,
        depositAmount: 20,
        depositPaid: false,
        requireDeposit: true,
        dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        businessId: "mock-business-id" as Id<"businesses">,
        userId: "mock-user-id" as Id<"users">,
        services: [],
      }
    }

    return null
  }

  async mutation(mutationFunction: any, args: any): Promise<any> {
    // Return mock data for mutations
    if (mutationFunction.toString().includes("create")) {
      return "mock-id" as Id<any>
    }

    return null
  }
}


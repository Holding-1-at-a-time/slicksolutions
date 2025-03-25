import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Convex API Documentation | Slick Solutions",
  description: "Documentation for Convex functions in the Slick Solutions platform",
}

export default function ConvexApiDocsPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Convex API Documentation</h1>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="mb-4">
            Slick Solutions uses Convex for backend functionality, real-time data synchronization, and vector search
            capabilities. This documentation covers the key Convex functions used in the application.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
          <p className="mb-4">
            Authentication is handled through Clerk, which provides JWTs that are verified by Convex. All Convex
            functions that require authentication will validate the user's identity and permissions.
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
            {`// Example of an authenticated Convex function
export default mutation({
  args: { /* ... */ },
  handler: async (ctx, args) => {
    // Get the authenticated user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    
    // Access user information
    const userId = identity.subject;
    const user = await ctx.db.query("users")
      .filter(q => q.eq(q.field("clerkId"), userId))
      .first();
    
    // Check permissions
    if (user.role !== "admin") {
      throw new Error("Forbidden");
    }
    
    // Proceed with the function logic
    // ...
  }
})`}
          </pre>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Business Functions</h2>

          <div className="border dark:border-gray-700 rounded-md p-4 mb-6">
            <h3 className="text-xl font-medium mb-2">Get Business</h3>
            <p className="mb-2">
              <strong>Query:</strong> businesses:get
            </p>
            <p className="mb-4">Retrieves a business by ID.</p>

            <h4 className="font-medium mb-2">Arguments</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              {`{
  id: v.id("businesses")
}`}
            </pre>

            <h4 className="font-medium mb-2">Returns</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
              {`{
  _id: Id<"businesses">,
  name: string,
  logo: string | undefined,
  primaryColor: string | undefined,
  secondaryColor: string | undefined,
  address: string | undefined,
  phone: string | undefined,
  email: string,
  website: string | undefined,
  depositPercentage: number | undefined,
  requireDeposit: boolean,
  stripeAccountId: string | undefined,
  subscriptionStatus: string,
  subscriptionTier: string,
  createdAt: number,
  updatedAt: number
}`}
            </pre>
          </div>

          <div className="border dark:border-gray-700 rounded-md p-4">
            <h3 className="text-xl font-medium mb-2">Update Business</h3>
            <p className="mb-2">
              <strong>Mutation:</strong> businesses:update
            </p>
            <p className="mb-4">Updates a business profile.</p>

            <h4 className="font-medium mb-2">Arguments</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              {`{
  id: v.id("businesses"),
  name: v.optional(v.string()),
  logo: v.optional(v.string()),
  primaryColor: v.optional(v.string()),
  secondaryColor: v.optional(v.string()),
  address: v.optional(v.string()),
  phone: v.optional(v.string()),
  email: v.optional(v.string()),
  website: v.optional(v.string()),
  depositPercentage: v.optional(v.number()),
  requireDeposit: v.optional(v.boolean())
}`}
            </pre>

            <h4 className="font-medium mb-2">Returns</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">{`Id<"businesses">`}</pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Assessment Functions</h2>

          <div className="border dark:border-gray-700 rounded-md p-4 mb-6">
            <h3 className="text-xl font-medium mb-2">Create Assessment</h3>
            <p className="mb-2">
              <strong>Mutation:</strong> assessments:create
            </p>
            <p className="mb-4">Creates a new vehicle assessment.</p>

            <h4 className="font-medium mb-2">Arguments</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              {`{
  businessId: v.id("businesses"),
  userId: v.id("users"),
  vehicleId: v.id("vehicles"),
  appointmentId: v.optional(v.id("appointments")),
  notes: v.string()
}`}
            </pre>

            <h4 className="font-medium mb-2">Returns</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">{`Id<"assessments">`}</pre>
          </div>

          <div className="border dark:border-gray-700 rounded-md p-4">
            <h3 className="text-xl font-medium mb-2">Upload Media</h3>
            <p className="mb-2">
              <strong>Mutation:</strong> assessments:uploadMedia
            </p>
            <p className="mb-4">Uploads media for an assessment and processes it with AI.</p>

            <h4 className="font-medium mb-2">Arguments</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              {`{
  assessmentId: v.id("assessments"),
  storageId: v.string(),
  type: v.string()
}`}
            </pre>

            <h4 className="font-medium mb-2">Returns</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">{`Id<"media">`}</pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Vector Search Functions</h2>

          <div className="border dark:border-gray-700 rounded-md p-4">
            <h3 className="text-xl font-medium mb-2">Search Similar Services</h3>
            <p className="mb-2">
              <strong>Query:</strong> vectorSearch:similarServices
            </p>
            <p className="mb-4">Searches for services similar to a given description using vector embeddings.</p>

            <h4 className="font-medium mb-2">Arguments</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              {`{
  businessId: v.id("businesses"),
  description: v.string(),
  limit: v.optional(v.number())
}`}
            </pre>

            <h4 className="font-medium mb-2">Returns</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
              {`Array<{
  service: {
    _id: Id<"services">,
    name: string,
    description: string,
    price: number,
    duration: number,
    category: string,
    isActive: boolean,
    businessId: Id<"businesses">,
    createdAt: number,
    updatedAt: number
  },
  score: number
}>`}
            </pre>
          </div>
        </section>
      </div>
    </div>
  )
}


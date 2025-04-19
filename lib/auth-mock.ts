// Mock implementation of Clerk auth functions for development/preview

export function auth() {
  return {
    userId: "mock-user-id",
    sessionId: "mock-session-id",
    getToken: async () => "mock-token",
  }
}

export function currentUser() {
  return {
    id: "mock-user-id",
    firstName: "Mock",
    lastName: "User",
    fullName: "Mock User",
    imageUrl: "/placeholder.svg?height=40&width=40",
    primaryEmailAddress: {
      emailAddress: "mock@example.com",
    },
    publicMetadata: {
      role: "client",
      hasCompletedOnboarding: false,
    },
  }
}

export const clerkClient = {
  users: {
    getUser: async (userId: string) => ({
      id: userId,
      firstName: "Mock",
      lastName: "User",
      publicMetadata: {
        role: "client",
        hasCompletedOnboarding: false,
      },
    }),
  },
}

export function authMiddleware(options: any) {
  return (req: Request) => {
    return new Response()
  }
}


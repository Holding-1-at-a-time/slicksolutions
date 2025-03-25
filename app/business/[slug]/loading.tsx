import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

export default function BusinessLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header skeleton */}
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-6 w-40 hidden md:inline-block" />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar skeleton */}
        <div className="hidden md:block w-[240px] border-r">
          <div className="px-3 py-4">
            <div className="space-y-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full rounded-md" />
              ))}
            </div>
          </div>
        </div>

        {/* Main content loading spinner */}
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <Spinner size="lg" className="mx-auto mb-4" />
            <h3 className="text-lg font-medium">Loading business data...</h3>
            <p className="text-sm text-muted-foreground mt-1">Please wait while we fetch the business information.</p>
          </div>
        </main>
      </div>
    </div>
  )
}


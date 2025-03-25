"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useConvexAuth } from "convex/react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircleIcon, DownloadIcon, ExpandIcon, MoreVerticalIcon, TrashIcon } from "lucide-react"

interface MediaItem {
  _id: Id<"media">
  assessmentId: Id<"assessments">
  storageId: string
  type: string
  aiAnalysis?: string
  createdAt: number
}

interface MediaGalleryProps {
  media: MediaItem[]
  onDelete?: () => void
}

export default function MediaGallery({ media, onDelete }: MediaGalleryProps) {
  const { isAuthenticated } = useConvexAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Convex mutation to delete media
  const deleteMedia = useMutation(api.media.remove)

  // Handle media deletion
  const handleDeleteMedia = async (mediaId: Id<"media">) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to delete media.",
        variant: "destructive",
      })
      return
    }

    setIsDeleting(true)

    try {
      await deleteMedia({ id: mediaId })

      toast({
        title: "Media deleted",
        description: "The media has been deleted successfully.",
      })

      // Close the viewer if open
      setIsViewerOpen(false)

      // Refresh the page to update the media list
      if (onDelete) {
        onDelete()
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error("Error deleting media:", error)
      toast({
        title: "Deletion failed",
        description: "There was an error deleting the media. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle media download
  const handleDownloadMedia = (media: MediaItem) => {
    const link = document.createElement("a")
    link.href = `/api/convex/storage/${media.storageId}`
    link.download = `assessment-media-${media._id}.${media.type === "image" ? "jpg" : "mp4"}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircleIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No media uploaded</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          No images or videos have been uploaded for this assessment yet.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item) => (
          <div
            key={item._id.toString()}
            className="group relative aspect-square rounded-md overflow-hidden border bg-muted"
          >
            <Image
              src={`/api/convex/storage/${item.storageId}`}
              alt="Assessment media"
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button
                variant="secondary"
                size="icon"
                className="mr-2"
                onClick={() => {
                  setSelectedMedia(item)
                  setIsViewerOpen(true)
                }}
              >
                <ExpandIcon className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon">
                    <MoreVerticalIcon className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleDownloadMedia(item)}>
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => handleDeleteMedia(item._id)}
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-4xl">
          {selectedMedia && (
            <>
              <DialogHeader>
                <DialogTitle>Media Viewer</DialogTitle>
                <DialogDescription>
                  Uploaded on {new Date(selectedMedia.createdAt).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>

              <div className="relative aspect-video w-full overflow-hidden rounded-md">
                <Image
                  src={`/api/convex/storage/${selectedMedia.storageId}`}
                  alt="Assessment media"
                  fill
                  className="object-contain"
                />
              </div>

              {selectedMedia.aiAnalysis && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-1">AI Analysis</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedMedia.aiAnalysis}</p>
                </div>
              )}

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => handleDownloadMedia(selectedMedia)}>
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteMedia(selectedMedia._id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Spinner className="mr-2" size="sm" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <TrashIcon className="mr-2 h-4 w-4" />
                      Delete
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}


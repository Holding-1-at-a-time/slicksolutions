"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useConvexAuth } from "convex/react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CalendarIcon, ClipboardCheckIcon, MoreHorizontalIcon, PencilIcon, TrashIcon, UploadIcon } from "lucide-react"

interface AssessmentActionsProps {
  assessment: {
    _id: Id<"assessments">
    status: string
    businessId: Id<"businesses">
    userId: Id<"users">
  }
  user: {
    _id: Id<"users">
    role: string
    businessId?: Id<"businesses">
  }
}

export default function AssessmentActions({ assessment, user }: AssessmentActionsProps) {
  const { isAuthenticated } = useConvexAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Convex mutations
  const updateAssessmentStatus = useMutation(api.assessments.updateStatus)
  const deleteAssessment = useMutation(api.assessments.remove)

  // Check if user has permission to edit this assessment
  const canEdit =
    isAuthenticated &&
    (user.role === "admin" ||
      (user.role === "member" && user.businessId === assessment.businessId) ||
      (user.role === "client" && user._id === assessment.userId))

  // Check if user has permission to delete this assessment
  const canDelete =
    isAuthenticated && (user.role === "admin" || (user.role === "member" && user.businessId === assessment.businessId))

  // Handle status update
  const handleUpdateStatus = async (status: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to update the assessment status.",
        variant: "destructive",
      })
      return
    }

    try {
      await updateAssessmentStatus({
        id: assessment._id,
        status,
      })

      toast({
        title: "Status updated",
        description: `Assessment status has been updated to ${status}.`,
      })

      router.refresh()
    } catch (error) {
      console.error("Error updating assessment status:", error)
      toast({
        title: "Update failed",
        description: "There was an error updating the assessment status. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle assessment deletion
  const handleDeleteAssessment = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to delete the assessment.",
        variant: "destructive",
      })
      return
    }

    setIsDeleting(true)

    try {
      await deleteAssessment({
        id: assessment._id,
      })

      toast({
        title: "Assessment deleted",
        description: "The assessment has been deleted successfully.",
      })

      router.push("/assessments")
      router.refresh()
    } catch (error) {
      console.error("Error deleting assessment:", error)
      toast({
        title: "Deletion failed",
        description: "There was an error deleting the assessment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => setIsUploadDialogOpen(true)} disabled={!canEdit}>
          <UploadIcon className="mr-2 h-4 w-4" />
          Upload Media
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/assessments/${assessment._id}/edit`)} disabled={!canEdit}>
              <PencilIcon className="mr-2 h-4 w-4" />
              Edit Assessment
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                const queryParams = new URLSearchParams({
                  assessmentId: assessment._id.toString(),
                })
                router.push(`/appointments/new?${queryParams.toString()}`)
              }}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Schedule Appointment
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                const queryParams = new URLSearchParams({
                  assessmentId: assessment._id.toString(),
                })
                router.push(`/invoices/new?${queryParams.toString()}`)
              }}
            >
              <ClipboardCheckIcon className="mr-2 h-4 w-4" />
              Create Invoice
            </DropdownMenuItem>

            {canDelete && (
              <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => setIsDeleteDialogOpen(true)}>
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete Assessment
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Upload Media Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
            <DialogDescription>Upload images or videos of the vehicle for assessment.</DialogDescription>
          </DialogHeader>

          {/* Media upload component would go here */}
          <p className="text-sm text-muted-foreground">
            This would contain a media upload component that allows uploading images and videos.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsUploadDialogOpen(false)}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the assessment and all associated media.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDeleteAssessment()
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Spinner className="mr-2" size="sm" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}


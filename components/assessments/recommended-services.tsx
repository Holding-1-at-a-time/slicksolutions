"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useConvexAuth } from "convex/react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import {
  AlertCircleIcon,
  CalendarIcon,
  ClipboardCheckIcon,
  MoreVerticalIcon,
  PlusIcon,
  TrashIcon,
  WrenchIcon,
} from "lucide-react"

interface Service {
  _id: Id<"services">
  name: string
  description: string
  price: number
  duration: number
  category: string
  isActive: boolean
  businessId: Id<"businesses">
}

interface RecommendedServicesProps {
  services: Service[]
  assessmentId?: Id<"assessments">
  onUpdate?: () => void
  isEditable?: boolean
}

export default function RecommendedServices({
  services,
  assessmentId,
  onUpdate,
  isEditable = false,
}: RecommendedServicesProps) {
  const { isAuthenticated } = useConvexAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<Id<"services">>()

  // Convex mutations
  const removeRecommendedService = useMutation(api.assessments.removeRecommendedService)

  // Calculate total price and duration
  const totalPrice = services.reduce((sum, service) => sum + service.price, 0)
  const totalDuration = services.reduce((sum, service) => sum + service.duration, 0)

  // Format duration as hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours === 0) {
      return `${mins} min`
    } else if (mins === 0) {
      return `${hours} hr`
    } else {
      return `${hours} hr ${mins} min`
    }
  }

  // Handle service removal
  const handleRemoveService = async (serviceId: Id<"services">) => {
    if (!isAuthenticated || !assessmentId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to remove services.",
        variant: "destructive",
      })
      return
    }

    setIsRemoving(true)
    setSelectedServiceId(serviceId)

    try {
      await removeRecommendedService({
        id: assessmentId,
        serviceId,
      })

      toast({
        title: "Service removed",
        description: "The service has been removed from recommendations.",
      })

      // Refresh the page or update the parent component
      if (onUpdate) {
        onUpdate()
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error("Error removing service:", error)
      toast({
        title: "Removal failed",
        description: "There was an error removing the service. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRemoving(false)
      setSelectedServiceId(undefined)
    }
  }

  // Handle creating an appointment with these services
  const handleCreateAppointment = () => {
    if (!assessmentId) return

    const serviceIds = services.map((service) => service._id.toString())
    const queryParams = new URLSearchParams({
      assessmentId: assessmentId.toString(),
      services: serviceIds.join(","),
    })

    router.push(`/appointments/new?${queryParams.toString()}`)
  }

  // Handle creating an invoice with these services
  const handleCreateInvoice = () => {
    if (!assessmentId) return

    const serviceIds = services.map((service) => service._id.toString())
    const queryParams = new URLSearchParams({
      assessmentId: assessmentId.toString(),
      services: serviceIds.join(","),
    })

    router.push(`/invoices/new?${queryParams.toString()}`)
  }

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <AlertCircleIcon className="h-10 w-10 text-muted-foreground mb-3" />
        <h3 className="text-base font-medium">No services recommended</h3>
        <p className="text-sm text-muted-foreground mt-1">No services have been recommended for this assessment yet.</p>
        {isEditable && assessmentId && (
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Services
          </Button>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          {services.map((service) => (
            <Card key={service._id.toString()} className="overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <WrenchIcon className="h-4 w-4 text-muted-foreground mr-2" />
                      <h4 className="font-medium">{service.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                    <div className="flex items-center text-sm">
                      <span className="font-medium">${service.price.toFixed(2)}</span>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{formatDuration(service.duration)}</span>
                    </div>
                  </div>

                  {isEditable && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="-mr-2">
                          <MoreVerticalIcon className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleRemoveService(service._id)}
                          disabled={isRemoving && selectedServiceId === service._id}
                        >
                          {isRemoving && selectedServiceId === service._id ? (
                            <>
                              <Spinner className="mr-2" size="sm" />
                              Removing...
                            </>
                          ) : (
                            <>
                              <TrashIcon className="mr-2 h-4 w-4" />
                              Remove
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Total Price:</span>
            <span className="font-medium">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Duration:</span>
            <span>{formatDuration(totalDuration)}</span>
          </div>
        </div>

        {isEditable && assessmentId && (
          <div className="pt-4 flex flex-col gap-2">
            <Button variant="outline" size="sm" className="w-full" onClick={() => setIsAddDialogOpen(true)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add More Services
            </Button>

            <Button variant="secondary" size="sm" className="w-full" onClick={handleCreateAppointment}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>

            <Button variant="default" size="sm" className="w-full" onClick={handleCreateInvoice}>
              <ClipboardCheckIcon className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </div>
        )}
      </div>

      {isEditable && assessmentId && (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Recommended Services</DialogTitle>
              <DialogDescription>Select services to recommend for this assessment.</DialogDescription>
            </DialogHeader>

            {/* Service selection component would go here */}
            <p className="text-sm text-muted-foreground">
              This would contain a service selection component that allows adding services to the assessment.
            </p>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Add Selected Services</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}


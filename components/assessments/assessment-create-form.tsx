"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useConvexAuth } from "convex/react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { CarIcon, ClipboardIcon, UserIcon } from "lucide-react"

interface AssessmentCreateFormProps {
  businessId: Id<"businesses">
  userId?: Id<"users">
  appointmentId?: Id<"appointments">
}

export default function AssessmentCreateForm({ businessId, userId, appointmentId }: AssessmentCreateFormProps) {
  const { isAuthenticated } = useConvexAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [selectedUserId, setSelectedUserId] = useState<Id<"users"> | undefined>(userId)
  const [selectedVehicleId, setSelectedVehicleId] = useState<Id<"vehicles">>()
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get clients for this business
  const clients = useQuery(api.users.listClientsByBusiness, { businessId }) || []

  // Get vehicles for the selected client
  const vehicles = useQuery(api.vehicles.listByUser, selectedUserId ? { userId: selectedUserId } : "skip") || []

  // Get appointment details if provided
  const appointment = useQuery(api.appointments.get, appointmentId ? { id: appointmentId } : "skip")

  // Convex mutation to create an assessment
  const createAssessment = useMutation(api.assessments.create)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create an assessment.",
        variant: "destructive",
      })
      return
    }

    if (!selectedUserId || !selectedVehicleId) {
      toast({
        title: "Missing information",
        description: "Please select a client and vehicle.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create the assessment
      const assessmentId = await createAssessment({
        businessId,
        userId: selectedUserId,
        vehicleId: selectedVehicleId,
        appointmentId,
        notes,
      })

      toast({
        title: "Assessment created",
        description: "The vehicle assessment has been created successfully.",
      })

      // Redirect to the assessment page
      router.push(`/assessments/${assessmentId}`)
      router.refresh()
    } catch (error) {
      console.error("Error creating assessment:", error)
      toast({
        title: "Creation failed",
        description: "There was an error creating the assessment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Vehicle Assessment</CardTitle>
        <CardDescription>
          Create a new assessment to evaluate a vehicle's condition and recommend services.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select
                value={selectedUserId?.toString()}
                onValueChange={(value) => {
                  setSelectedUserId(value as Id<"users">)
                  setSelectedVehicleId(undefined) // Reset vehicle when client changes
                }}
                disabled={!!userId || isSubmitting}
              >
                <SelectTrigger id="client" className="w-full">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client._id.toString()} value={client._id.toString()}>
                      <div className="flex items-center">
                        <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        {client.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicle">Vehicle</Label>
              <Select
                value={selectedVehicleId?.toString()}
                onValueChange={(value) => setSelectedVehicleId(value as Id<"vehicles">)}
                disabled={!selectedUserId || isSubmitting}
              >
                <SelectTrigger id="vehicle" className="w-full">
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle._id.toString()} value={vehicle._id.toString()}>
                      <div className="flex items-center">
                        <CarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        {vehicle.year} {vehicle.make} {vehicle.model} ({vehicle.color})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedUserId && vehicles.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  No vehicles found for this client.{" "}
                  <Button
                    variant="link"
                    className="h-auto p-0 text-sm"
                    onClick={() => router.push(`/vehicles/new?userId=${selectedUserId}`)}
                  >
                    Add a vehicle
                  </Button>
                </p>
              )}
            </div>

            {appointmentId && appointment && (
              <div className="rounded-md bg-muted p-4">
                <div className="flex items-start gap-3">
                  <ClipboardIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Linked Appointment</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(appointment.startTime).toLocaleDateString()} at{" "}
                      {new Date(appointment.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.services?.length || 0} service(s) scheduled
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Assessment Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any initial notes about the vehicle condition..."
                rows={4}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !selectedUserId || !selectedVehicleId}>
            {isSubmitting ? (
              <>
                <Spinner className="mr-2" />
                Creating...
              </>
            ) : (
              "Create Assessment"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}


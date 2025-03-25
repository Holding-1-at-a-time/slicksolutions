"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useConvexAuth } from "convex/react"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { CalendarIcon, ClipboardCheckIcon, CreditCardIcon, UserIcon } from "lucide-react"

interface Service {
  _id: Id<"services">
  name: string
  description: string
  price: number
  duration: number
  category: string
}

interface Invoice {
  _id: Id<"invoices">
  businessId: Id<"businesses">
  userId: Id<"users">
  vehicleId: Id<"vehicles">
  assessmentId?: Id<"assessments">
  appointmentId?: Id<"appointments">
  services: Service[]
  status: string
  total: number
  subtotal: number
  tax: number
  depositAmount?: number
  depositPaid?: boolean
  requireDeposit: boolean
  dueDate: number
  notes?: string
  createdAt: number
  updatedAt: number
}

interface User {
  _id: Id<"users">
  name: string
  email: string
  phone?: string
}

interface Vehicle {
  _id: Id<"vehicles">
  make: string
  model: string
  year: number
  color: string
  licensePlate?: string
}

interface InvoiceDetailsProps {
  invoice: Invoice
  user?: User
  vehicle?: Vehicle
}

export default function InvoiceDetails({ invoice, user, vehicle }: InvoiceDetailsProps) {
  const { isAuthenticated } = useConvexAuth()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Format date
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Get status badge color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "paid":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "overdue":
        return "bg-red-500"
      case "cancelled":
        return "bg-gray-500"
      default:
        return "bg-blue-500"
    }
  }

  // Handle payment
  const handlePayment = () => {
    setIsLoading(true)
    router.push(`/invoices/${invoice._id}/payment`)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Invoice #{invoice._id.toString().slice(-6)}</CardTitle>
            <CardDescription>Created on {formatDate(invoice.createdAt)}</CardDescription>
          </div>
          <Badge className={getStatusColor(invoice.status)}>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Client Information</h3>
            <div className="rounded-md border p-3">
              {user ? (
                <div className="space-y-1">
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Client information not available</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Vehicle Information</h3>
            <div className="rounded-md border p-3">
              {vehicle ? (
                <div className="space-y-1">
                  <div className="flex items-center">
                    <span className="font-medium">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Color: {vehicle.color}</p>
                  {vehicle.licensePlate && (
                    <p className="text-sm text-muted-foreground">License Plate: {vehicle.licensePlate}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Vehicle information not available</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Services</h3>
          <div className="rounded-md border overflow-hidden">
            <table className="min-w-full divide-y">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Service</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoice.services.map((service) => (
                  <tr key={service._id.toString()}>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{service.description}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">{formatCurrency(service.price)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/50">
                <tr>
                  <td className="px-4 py-2 text-sm font-medium">Subtotal</td>
                  <td className="px-4 py-2 text-right text-sm">{formatCurrency(invoice.subtotal)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-medium">Tax</td>
                  <td className="px-4 py-2 text-right text-sm">{formatCurrency(invoice.tax)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-base font-bold">Total</td>
                  <td className="px-4 py-2 text-right text-base font-bold">{formatCurrency(invoice.total)}</td>
                </tr>
                {invoice.requireDeposit && invoice.depositAmount && (
                  <tr>
                    <td className="px-4 py-2 text-sm font-medium">Deposit Required</td>
                    <td className="px-4 py-2 text-right text-sm">
                      {formatCurrency(invoice.depositAmount)}
                      {invoice.depositPaid && (
                        <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200">
                          Paid
                        </Badge>
                      )}
                    </td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>
        </div>

        {invoice.notes && (
          <div>
            <h3 className="text-sm font-medium mb-2">Notes</h3>
            <div className="rounded-md border p-3">
              <p className="text-sm whitespace-pre-line">{invoice.notes}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground">
          {invoice.appointmentId && (
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>Linked to appointment</span>
            </div>
          )}

          {invoice.assessmentId && (
            <div className="flex items-center">
              <ClipboardCheckIcon className="h-4 w-4 mr-1" />
              <span>Based on assessment</span>
            </div>
          )}

          <div className="flex items-center">
            <CreditCardIcon className="h-4 w-4 mr-1" />
            <span>Due by {formatDate(invoice.dueDate)}</span>
          </div>
        </div>
      </CardContent>

      {invoice.status !== "paid" && (
        <CardFooter>
          <Button onClick={handlePayment} disabled={isLoading || !isAuthenticated} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Spinner className="mr-2" size="sm" />
                Processing...
              </>
            ) : (
              <>
                <CreditCardIcon className="mr-2 h-4 w-4" />
                Pay Invoice
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}


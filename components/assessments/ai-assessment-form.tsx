"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useConvexAuth } from "convex/react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadDropzone } from "@/components/ui/upload-dropzone"
import { Spinner } from "@/components/ui/spinner"
import { CheckCircleIcon, ImageIcon, SendIcon } from "lucide-react"

interface AIAssessmentFormProps {
  assessmentId: Id<"assessments">
  vehicleId: Id<"vehicles">
  initialNotes?: string
}

export default function AIAssessmentForm({ assessmentId, vehicleId, initialNotes = "" }: AIAssessmentFormProps) {
  const { isAuthenticated } = useConvexAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [notes, setNotes] = useState(initialNotes)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")

  const updateAssessment = useMutation(api.assessments.update)

  // Handle file upload
  const handleFileUpload = async (files: File[]) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload files.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // This would be replaced with actual file upload logic using Convex storage
      // For now, we'll simulate the upload
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful uploads with fake storage IDs
      const newUploadedFiles = files.map((_, index) => `storage_${Math.random().toString(36).substring(2, 15)}`)

      setUploadedFiles((prev) => [...prev, ...newUploadedFiles])

      toast({
        title: "Files uploaded",
        description: `Successfully uploaded ${files.length} file(s).`,
      })
    } catch (error) {
      console.error("Error uploading files:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Process assessment with AI
  const processAssessment = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to process the assessment.",
        variant: "destructive",
      })
      return
    }

    if (uploadedFiles.length === 0) {
      toast({
        title: "No files uploaded",
        description: "Please upload at least one image to process the assessment.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Update assessment notes if changed
      if (notes !== initialNotes) {
        await updateAssessment({
          id: assessmentId,
          notes,
        })
      }

      // This would be replaced with actual AI processing logic
      // For now, we'll simulate the processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      toast({
        title: "Assessment processed",
        description: "The AI has successfully analyzed your vehicle images.",
      })

      // Redirect to assessment details page
      router.push(`/assessments/${assessmentId}`)
      router.refresh()
    } catch (error) {
      console.error("Error processing assessment:", error)
      toast({
        title: "Processing failed",
        description: "There was an error processing your assessment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Assessment</CardTitle>
        <CardDescription>
          Upload images of your vehicle and our AI will analyze them to provide recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="upload">
              <ImageIcon className="h-4 w-4 mr-2" />
              Upload Images
            </TabsTrigger>
            <TabsTrigger value="notes">
              <SendIcon className="h-4 w-4 mr-2" />
              Add Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <div className="space-y-4">
              <UploadDropzone
                onUpload={handleFileUpload}
                isUploading={isUploading}
                accept={{
                  "image/*": [".png", ".jpg", ".jpeg", ".webp"],
                }}
                maxFiles={10}
                maxSize={10 * 1024 * 1024} // 10MB
              />

              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Uploaded Files ({uploadedFiles.length})</h3>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-muted-foreground">
                      {uploadedFiles.length} file(s) uploaded successfully
                    </span>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <div className="space-y-4">
              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Describe any specific issues or areas of concern..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  className="mt-1"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={processAssessment} disabled={isUploading || isProcessing || uploadedFiles.length === 0}>
          {isProcessing ? (
            <>
              <Spinner className="mr-2" />
              Processing...
            </>
          ) : (
            <>Process with AI</>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}


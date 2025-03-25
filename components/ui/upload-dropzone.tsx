"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { CloudIcon, FileIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react"

interface UploadDropzoneProps {
  onUpload: (files: File[]) => Promise<void>
  isUploading?: boolean
  accept?: Record<string, string[]>
  maxFiles?: number
  maxSize?: number
  className?: string
}

export function UploadDropzone({
  onUpload,
  isUploading = false,
  accept,
  maxFiles = 1,
  maxSize = 8 * 1024 * 1024, // 8MB
  className,
}: UploadDropzoneProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    disabled: isUploading,
  })

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      await onUpload(selectedFiles)
      setSelectedFiles([])
    }
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/30",
          isUploading && "opacity-50 cursor-not-allowed",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          {isDragActive ? (
            <CloudIcon className="h-10 w-10 text-primary" />
          ) : (
            <UploadIcon className="h-10 w-10 text-muted-foreground" />
          )}
          <div className="space-y-1">
            <p className="text-sm font-medium">{isDragActive ? "Drop files here" : "Drag & drop files here"}</p>
            <p className="text-xs text-muted-foreground">or click to browse</p>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {accept &&
              Object.entries(accept).map(([type, extensions]) => (
                <span key={type}>
                  {type === "image/*" ? "Images" : type} ({extensions.join(", ")})
                </span>
              ))}
            {maxFiles > 1 && <span className="block">Up to {maxFiles} files</span>}
            <span className="block">Max size: {Math.round(maxSize / 1024 / 1024)}MB</span>
          </div>
        </div>
      </div>

      {fileRejections.length > 0 && (
        <div className="text-sm text-red-500">
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name} className="mt-1">
              <span className="font-medium">{file.name}:</span> {errors.map((e) => e.message).join(", ")}
            </div>
          ))}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Selected Files:</div>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between rounded-md border p-2">
                <div className="flex items-center gap-2 truncate">
                  {file.type.startsWith("image/") ? (
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">({Math.round(file.size / 1024)} KB)</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveFile(index)} disabled={isUploading}>
                  <XIcon className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            ))}
          </div>
          <Button onClick={handleUpload} disabled={isUploading || selectedFiles.length === 0} className="w-full">
            {isUploading ? (
              <>
                <Spinner className="mr-2" size="sm" />
                Uploading...
              </>
            ) : (
              <>
                <UploadIcon className="mr-2 h-4 w-4" />
                Upload {selectedFiles.length} {selectedFiles.length === 1 ? "file" : "files"}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}


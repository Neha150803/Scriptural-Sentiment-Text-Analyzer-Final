"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, FileText } from "lucide-react"
import type { SentimentResult } from "@/app/page"

interface FileUploadProps {
  setResults: (results: SentimentResult) => void
  setLoading: (loading: boolean) => void
  loading: boolean
}

export function FileUpload({ setResults, setLoading, loading }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile)
      } else {
        alert("Please upload a PDF file")
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/sentiment/predict-file", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Analysis failed: ${response.status}`)
      }

      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Error analyzing file:", error)
      alert(`Failed to analyze file: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input ref={inputRef} type="file" accept=".pdf" onChange={handleChange} className="hidden" />
        <div className="flex flex-col items-center gap-4">
          {file ? (
            <>
              <FileText className="h-12 w-12 text-primary" />
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              <Button variant="outline" onClick={() => inputRef.current?.click()}>
                Change File
              </Button>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Drop your PDF here or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">PDF files only</p>
              </div>
              <Button variant="outline" onClick={() => inputRef.current?.click()}>
                Select File
              </Button>
            </>
          )}
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={loading || !file} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Analyze PDF
          </>
        )}
      </Button>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send } from "lucide-react"
import type { SentimentResult } from "@/app/page"

interface TextInputProps {
  setResults: (results: SentimentResult) => void
  setLoading: (loading: boolean) => void
  loading: boolean
}

export function TextInput({ setResults, setLoading, loading }: TextInputProps) {
  const [text, setText] = useState("")

  const handleSubmit = async () => {
    if (!text.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/sentiment/predict-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Analysis failed: ${response.status}`)
      }

      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Error analyzing text:", error)
      alert(`Failed to analyze text: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter scriptural text for sentiment analysis..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[200px] font-mono text-sm"
      />
      <Button onClick={handleSubmit} disabled={loading || !text.trim()} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Analyze Text
          </>
        )}
      </Button>
    </div>
  )
}

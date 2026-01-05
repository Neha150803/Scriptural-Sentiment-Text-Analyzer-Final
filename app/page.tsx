"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/file-upload"
import { TextInput } from "@/components/text-input"
import { AnalysisResults } from "@/components/analysis-results"
import { BookOpen } from "lucide-react"

export interface SentimentResult {
  id: string
  inputText: string
  cleanedText: string
  wordCount: number
  charCount: number
  mlPrediction: {
    confidence: number
    probabilities: {
      negative: number
      neutral: number
      positive: number
    }
    sentiment: string
  }
  vaderAnalysis: {
    compound: number
    negative: number
    neutral: number
    positive: number
    sentiment: string
  }
  textblobAnalysis: {
    polarity: number
    sentiment: string
    subjectivity: number
  }
  demoMode?: boolean
}

export default function Home() {
  const [results, setResults] = useState<SentimentResult | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Scriptural Data Analysis</h1>
              <p className="text-sm text-muted-foreground">
                Statistical analysis of words, positivity, and negativity in scriptures
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Analysis</CardTitle>
              <CardDescription>
                Upload a PDF or enter text to analyze sentiment using multiple ML models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">Text Input</TabsTrigger>
                  <TabsTrigger value="pdf">PDF Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="mt-6">
                  <TextInput setResults={setResults} setLoading={setLoading} loading={loading} />
                </TabsContent>
                <TabsContent value="pdf" className="mt-6">
                  <FileUpload setResults={setResults} setLoading={setLoading} loading={loading} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {results && <AnalysisResults results={results} />}
        </div>
      </main>
    </div>
  )
}

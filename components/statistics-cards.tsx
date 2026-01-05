"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Type, BarChart3, TrendingUp } from "lucide-react"
import type { SentimentResult } from "@/app/page"

interface StatisticsCardsProps {
  results: SentimentResult
}

export function StatisticsCards({ results }: StatisticsCardsProps) {
  const avgWordLength = (results.charCount / results.wordCount).toFixed(2)

  const sentiments = [
    results.mlPrediction.sentiment,
    results.vaderAnalysis.sentiment,
    results.textblobAnalysis.sentiment,
  ]
  const positiveCount = sentiments.filter((s) => s === "positive").length
  const negativeCount = sentiments.filter((s) => s === "negative").length
  const neutralCount = sentiments.filter((s) => s === "neutral").length

  let consensus = "Mixed"
  if (positiveCount >= 2) consensus = "Positive"
  else if (negativeCount >= 2) consensus = "Negative"
  else if (neutralCount >= 2) consensus = "Neutral"

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Word Count</CardTitle>
          <Type className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{results.wordCount}</div>
          <p className="text-xs text-muted-foreground">{results.charCount} characters</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Word Length</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgWordLength}</div>
          <p className="text-xs text-muted-foreground">characters per word</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Model Consensus</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{consensus}</div>
          <p className="text-xs text-muted-foreground">
            {positiveCount}+ / {negativeCount}- / {neutralCount}~
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ML Confidence</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(results.mlPrediction.confidence * 100).toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">{results.mlPrediction.sentiment}</p>
        </CardContent>
      </Card>
    </div>
  )
}

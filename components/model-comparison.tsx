"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SentimentResult } from "@/app/page"
import { Brain, Activity, Sparkles } from "lucide-react"

interface ModelComparisonProps {
  results: SentimentResult
}

export function ModelComparison({ results }: ModelComparisonProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "negative":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "neutral":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">ML Prediction</CardTitle>
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <CardDescription>Neural network model</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Sentiment</span>
            <Badge className={getSentimentColor(results.mlPrediction.sentiment)}>
              {results.mlPrediction.sentiment}
            </Badge>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Confidence</span>
              <span className="text-sm text-muted-foreground">
                {(results.mlPrediction.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${results.mlPrediction.confidence * 100}%` }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-500">Positive</span>
              <span>{(results.mlPrediction.probabilities.positive * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-500">Negative</span>
              <span>{(results.mlPrediction.probabilities.negative * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-500">Neutral</span>
              <span>{(results.mlPrediction.probabilities.neutral * 100).toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">VADER Analysis</CardTitle>
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <CardDescription>Lexicon-based model</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Sentiment</span>
            <Badge className={getSentimentColor(results.vaderAnalysis.sentiment)}>
              {results.vaderAnalysis.sentiment}
            </Badge>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Compound Score</span>
              <span className="text-sm text-muted-foreground">{results.vaderAnalysis.compound.toFixed(3)}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  results.vaderAnalysis.compound >= 0 ? "bg-green-500" : "bg-red-500"
                }`}
                style={{
                  width: `${Math.abs(results.vaderAnalysis.compound) * 50 + 50}%`,
                  marginLeft: results.vaderAnalysis.compound < 0 ? "0" : "50%",
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-500">Positive</span>
              <span>{(results.vaderAnalysis.positive * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-500">Negative</span>
              <span>{(results.vaderAnalysis.negative * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-500">Neutral</span>
              <span>{(results.vaderAnalysis.neutral * 100).toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">TextBlob Analysis</CardTitle>
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <CardDescription>Pattern-based model</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Sentiment</span>
            <Badge className={getSentimentColor(results.textblobAnalysis.sentiment)}>
              {results.textblobAnalysis.sentiment}
            </Badge>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Polarity</span>
              <span className="text-sm text-muted-foreground">{results.textblobAnalysis.polarity.toFixed(3)}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  results.textblobAnalysis.polarity >= 0 ? "bg-green-500" : "bg-red-500"
                }`}
                style={{
                  width: `${Math.abs(results.textblobAnalysis.polarity) * 50 + 50}%`,
                  marginLeft: results.textblobAnalysis.polarity < 0 ? "0" : "50%",
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Subjectivity</span>
              <span className="text-sm text-muted-foreground">{results.textblobAnalysis.subjectivity.toFixed(3)}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${results.textblobAnalysis.subjectivity * 100}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Subjectivity ranges from 0 (objective) to 1 (subjective)</p>
        </CardContent>
      </Card>
    </div>
  )
}

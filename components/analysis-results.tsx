"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Download, FileDown, Info } from "lucide-react"
import type { SentimentResult } from "@/app/page"
import { SentimentCharts } from "@/components/sentiment-charts"
import { StatisticsCards } from "@/components/statistics-cards"
import { ModelComparison } from "@/components/model-comparison"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

interface AnalysisResultsProps {
  results: SentimentResult
}

export function AnalysisResults({ results }: AnalysisResultsProps) {
  const downloadJSON = () => {
    const dataStr = JSON.stringify(results, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `sentiment-analysis-${results.id}.json`
    link.click()
  }

  const downloadCSV = () => {
    const csvRows = [
      ["Metric", "Value"],
      ["ID", results.id],
      ["Word Count", results.wordCount.toString()],
      ["Character Count", results.charCount.toString()],
      ["ML Sentiment", results.mlPrediction.sentiment],
      ["ML Confidence", results.mlPrediction.confidence.toString()],
      ["ML Positive Prob", results.mlPrediction.probabilities.positive.toString()],
      ["ML Negative Prob", results.mlPrediction.probabilities.negative.toString()],
      ["ML Neutral Prob", results.mlPrediction.probabilities.neutral.toString()],
      ["VADER Sentiment", results.vaderAnalysis.sentiment],
      ["VADER Compound", results.vaderAnalysis.compound.toString()],
      ["VADER Positive", results.vaderAnalysis.positive.toString()],
      ["VADER Negative", results.vaderAnalysis.negative.toString()],
      ["VADER Neutral", results.vaderAnalysis.neutral.toString()],
      ["TextBlob Sentiment", results.textblobAnalysis.sentiment],
      ["TextBlob Polarity", results.textblobAnalysis.polarity.toString()],
      ["TextBlob Subjectivity", results.textblobAnalysis.subjectivity.toString()],
    ]

    const csvContent = csvRows.map((row) => row.join(",")).join("\n")
    const dataBlob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `sentiment-analysis-${results.id}.csv`
    link.click()
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    let yPosition = 20

    // Title
    doc.setFontSize(20)
    doc.setTextColor(0, 0, 0)
    doc.text("Scriptural Sentiment Analysis Report", pageWidth / 2, yPosition, { align: "center" })
    yPosition += 15

    // Analysis ID and Date
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Analysis ID: ${results.id}`, 20, yPosition)
    yPosition += 5
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, yPosition)
    yPosition += 15

    // Input Text Section
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text("Input Text", 20, yPosition)
    yPosition += 7
    doc.setFontSize(10)
    doc.setTextColor(60, 60, 60)
    const inputLines = doc.splitTextToSize(results.inputText, pageWidth - 40)
    doc.text(inputLines, 20, yPosition)
    yPosition += inputLines.length * 5 + 10

    // Cleaned Text Section
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text("Cleaned Text", 20, yPosition)
    yPosition += 7
    doc.setFontSize(10)
    doc.setTextColor(60, 60, 60)
    const cleanedLines = doc.splitTextToSize(results.cleanedText, pageWidth - 40)
    doc.text(cleanedLines, 20, yPosition)
    yPosition += cleanedLines.length * 5 + 15

    // Statistics Table
    if (yPosition > 230) {
      doc.addPage()
      yPosition = 20
    }
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text("Text Statistics", 20, yPosition)
    yPosition += 10

    autoTable(doc, {
      startY: yPosition,
      head: [["Metric", "Value"]],
      body: [
        ["Word Count", results.wordCount.toString()],
        ["Character Count", results.charCount.toString()],
        ["Average Word Length", (results.charCount / results.wordCount).toFixed(2)],
      ],
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] },
    })

    yPosition = (doc as any).lastAutoTable.finalY + 15

    // ML Prediction Section
    if (yPosition > 200) {
      doc.addPage()
      yPosition = 20
    }
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text("ML Prediction Model", 20, yPosition)
    yPosition += 10

    // Sentiment badge color
    const mlColor =
      results.mlPrediction.sentiment === "positive"
        ? [34, 197, 94]
        : results.mlPrediction.sentiment === "negative"
          ? [239, 68, 68]
          : [59, 130, 246]

    autoTable(doc, {
      startY: yPosition,
      head: [["Metric", "Value"]],
      body: [
        ["Sentiment", results.mlPrediction.sentiment.toUpperCase()],
        ["Confidence", `${(results.mlPrediction.confidence * 100).toFixed(2)}%`],
        ["Positive Probability", `${(results.mlPrediction.probabilities.positive * 100).toFixed(2)}%`],
        ["Negative Probability", `${(results.mlPrediction.probabilities.negative * 100).toFixed(2)}%`],
        ["Neutral Probability", `${(results.mlPrediction.probabilities.neutral * 100).toFixed(2)}%`],
      ],
      theme: "grid",
      headStyles: { fillColor: mlColor },
    })

    yPosition = (doc as any).lastAutoTable.finalY + 15

    // VADER Analysis Section
    if (yPosition > 200) {
      doc.addPage()
      yPosition = 20
    }
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text("VADER Analysis", 20, yPosition)
    yPosition += 10

    const vaderColor =
      results.vaderAnalysis.sentiment === "positive"
        ? [34, 197, 94]
        : results.vaderAnalysis.sentiment === "negative"
          ? [239, 68, 68]
          : [59, 130, 246]

    autoTable(doc, {
      startY: yPosition,
      head: [["Metric", "Value"]],
      body: [
        ["Sentiment", results.vaderAnalysis.sentiment.toUpperCase()],
        ["Compound Score", results.vaderAnalysis.compound.toFixed(4)],
        ["Positive Score", results.vaderAnalysis.positive.toFixed(4)],
        ["Negative Score", results.vaderAnalysis.negative.toFixed(4)],
        ["Neutral Score", results.vaderAnalysis.neutral.toFixed(4)],
      ],
      theme: "grid",
      headStyles: { fillColor: vaderColor },
    })

    yPosition = (doc as any).lastAutoTable.finalY + 15

    // TextBlob Analysis Section
    if (yPosition > 200) {
      doc.addPage()
      yPosition = 20
    }
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text("TextBlob Analysis", 20, yPosition)
    yPosition += 10

    const textblobColor =
      results.textblobAnalysis.sentiment === "positive"
        ? [34, 197, 94]
        : results.textblobAnalysis.sentiment === "negative"
          ? [239, 68, 68]
          : [59, 130, 246]

    autoTable(doc, {
      startY: yPosition,
      head: [["Metric", "Value"]],
      body: [
        ["Sentiment", results.textblobAnalysis.sentiment.toUpperCase()],
        ["Polarity", results.textblobAnalysis.polarity.toFixed(4)],
        ["Subjectivity", results.textblobAnalysis.subjectivity.toFixed(4)],
      ],
      theme: "grid",
      headStyles: { fillColor: textblobColor },
    })

    // Save the PDF
    doc.save(`sentiment-analysis-${results.id}.pdf`)
  }

  return (
    <div className="space-y-6">
      {results.demoMode && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Demo Mode Active</AlertTitle>
          <AlertDescription>
            The backend server is not accessible. Showing demo results with mock sentiment analysis. To connect to your
            real backend, set the <code className="text-xs bg-muted px-1 py-0.5 rounded">BACKEND_URL</code> environment
            variable to your API endpoint.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                ID: {results.id}
                {results.demoMode && <span className="text-yellow-500 ml-2">(Demo Mode)</span>}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={downloadPDF} className="gap-2">
                <FileDown className="h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" size="sm" onClick={downloadJSON}>
                <Download className="mr-2 h-4 w-4" />
                JSON
              </Button>
              <Button variant="outline" size="sm" onClick={downloadCSV}>
                <Download className="mr-2 h-4 w-4" />
                CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Input Text</h3>
              <p className="text-sm bg-secondary p-4 rounded-lg font-mono">{results.inputText}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Cleaned Text</h3>
              <p className="text-sm bg-secondary p-4 rounded-lg font-mono">{results.cleanedText}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <StatisticsCards results={results} />

      <ModelComparison results={results} />

      <SentimentCharts results={results} />
    </div>
  )
}

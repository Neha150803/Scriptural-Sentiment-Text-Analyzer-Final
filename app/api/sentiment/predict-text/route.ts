import { type NextRequest, NextResponse } from "next/server"
import { mockAnalysisResult } from "@/lib/mock-data"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text } = body

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Get backend URL from environment variable or use default
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8080"

    console.log("[v0] Sending text analysis request to backend:", backendUrl)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(`${backendUrl}/api/sentiment/predict-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Backend error:", response.status, errorText)
        throw new Error(`Backend returned ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Successfully received analysis from backend")
      return NextResponse.json(data)
    } catch (fetchError) {
      console.log("[v0] Backend unavailable, using demo mode")

      // Return mock data with the user's input text
      const demoResult = {
        ...mockAnalysisResult,
        input_text: text,
        cleaned_text: text
          .toLowerCase()
          .replace(/[^\w\s]/g, "")
          .split(/\s+/)
          .filter((word) => word.length > 3)
          .join(" "),
        word_count: text.split(/\s+/).length,
        char_count: text.length,
        avg_word_length: text.length / text.split(/\s+/).length,
        demo_mode: true,
      }

      return NextResponse.json(demoResult)
    }
  } catch (error) {
    console.error("[v0] Error in text analysis API route:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

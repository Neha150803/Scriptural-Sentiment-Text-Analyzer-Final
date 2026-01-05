import { type NextRequest, NextResponse } from "next/server"
import { mockFileAnalysisResult } from "@/lib/mock-data"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "PDF file is required" }, { status: 400 })
    }

    // Get backend URL from environment variable or use default
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8080"

    console.log("[v0] Sending file analysis request to backend:", backendUrl)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout for file uploads

      const backendFormData = new FormData()
      backendFormData.append("file", file)

      const response = await fetch(`${backendUrl}/api/sentiment/predict-file`, {
        method: "POST",
        body: backendFormData,
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
      console.log("[v0] Backend unavailable, using demo mode for file:", file.name)

      // Return mock data with file information
      const demoResult = {
        ...mockFileAnalysisResult,
        demo_mode: true,
        file_name: file.name,
      }

      return NextResponse.json(demoResult)
    }
  } catch (error) {
    console.error("[v0] Error in file analysis API route:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

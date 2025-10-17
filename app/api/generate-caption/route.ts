import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"
import { getGeminiApiKey, getGeminiModel } from "@/lib/api-config"

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, mimeType } = await request.json()

    let apiKey: string
    try {
      apiKey = getGeminiApiKey()
    } catch (error) {
      console.error("[v0] API Configuration Error:", error instanceof Error ? error.message : String(error))
      return NextResponse.json(
        {
          error:
            "API configuration error: Gemini API key is not set. Please configure GEMINI_API_KEY in your environment variables or update lib/api-config.ts",
        },
        { status: 500 },
      )
    }

    if (!imageBase64) {
      console.error("[v0] No image data provided")
      return NextResponse.json({ error: "No image data provided" }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: getGeminiModel() })

    console.log("[v0] Generating caption for image with mime type:", mimeType)

    const result = await model.generateContent([
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType || "image/jpeg",
        },
      },
      "Generate a creative and descriptive caption for this image in 1-2 sentences. Make it engaging and informative.",
    ])

    const caption = result.response.text() || "Unable to generate caption"
    console.log("[v0] Caption generated successfully")

    return NextResponse.json({ caption })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("[v0] Caption generation error:", errorMessage)
    console.error("[v0] Full error:", error)

    return NextResponse.json({ error: `Failed to generate caption: ${errorMessage}` }, { status: 500 })
  }
}

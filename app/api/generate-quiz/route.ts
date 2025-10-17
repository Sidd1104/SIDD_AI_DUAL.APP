import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"
import { getGeminiApiKey, getGeminiModel } from "@/lib/api-config"

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty, count } = await request.json()

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

    if (!topic || !topic.trim()) {
      console.error("[v0] No topic provided")
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: getGeminiModel() })

    console.log("[v0] Generating quiz questions for topic:", topic, "difficulty:", difficulty, "count:", count)

    const prompt = `Generate ${count} multiple-choice quiz questions about "${topic}" at ${difficulty} difficulty level.
    
Format each question as JSON with this structure:
{
  "question": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Why this is correct"
}

Return only a JSON array of questions, no other text.`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    // Parse the JSON response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/)
    const questions = jsonMatch ? JSON.parse(jsonMatch[0]) : []

    if (!questions || questions.length === 0) {
      console.error("[v0] No questions generated from API response")
      return NextResponse.json({ error: "Failed to generate quiz questions. Please try again." }, { status: 500 })
    }

    console.log("[v0] Quiz questions generated successfully, count:", questions.length)

    return NextResponse.json({ questions })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("[v0] Quiz generation error:", errorMessage)
    console.error("[v0] Full error:", error)

    return NextResponse.json({ error: `Failed to generate quiz questions: ${errorMessage}` }, { status: 500 })
  }
}

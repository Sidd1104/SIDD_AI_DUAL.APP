/**
 * Centralized API Configuration
 * This file manages all API keys and configurations for the project.
 * Update the API keys here when limits are reached or credentials change.
 */

// Gemini API Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBMFGEJK_pUfxsIV7UOQ19Gaa6EwNXfnjo"

// Validate API configuration
export function validateApiConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === "") {
    errors.push("GEMINI_API_KEY is not configured")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Export API configuration
export const apiConfig = {
  gemini: {
    apiKey: GEMINI_API_KEY,
    model: "gemini-2.0-flash",
  },
}

// Helper function to get Gemini API key with validation
export function getGeminiApiKey(): string {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === "") {
    throw new Error(
      "Gemini API key is not configured. Please set GEMINI_API_KEY environment variable or update lib/api-config.ts",
    )
  }
  return GEMINI_API_KEY
}

// Helper function to get Gemini model name
export function getGeminiModel(): string {
  return apiConfig.gemini.model
}

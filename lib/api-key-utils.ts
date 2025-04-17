/**
 * Utility functions for API key validation and testing
 */

// Validate API key format
export function isValidApiKeyFormat(apiKey: string): boolean {
  // Check if the API key starts with "sk-" and has a reasonable length
  return apiKey.startsWith("sk-") && apiKey.length >= 20
}

// Test if the API key works with OpenAI API
export async function testApiKey(apiKey: string): Promise<{
  valid: boolean
  error?: string
  model?: string
}> {
  try {
    // Make a lightweight request to OpenAI to check if the API key works
    const response = await fetch("/api/validate-key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        valid: false,
        error: data.error || "Invalid API key",
      }
    }

    return {
      valid: true,
      model: data.model,
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Get API key status
export function getApiKeyStatus(): "missing" | "stored" | "invalid" {
  const apiKey = localStorage.getItem("openai_api_key")

  if (!apiKey) {
    return "missing"
  }

  // If there's a key but no validation status, assume it's valid
  // This helps with existing keys that were added before validation was implemented
  const validationStatus = localStorage.getItem("openai_api_key_valid")

  if (validationStatus === "false") {
    return "invalid"
  }

  return "stored"
}

// Store API key with validation status
export function storeApiKey(apiKey: string, isValid: boolean): void {
  localStorage.setItem("openai_api_key", apiKey)
  localStorage.setItem("openai_api_key_valid", isValid.toString())
  localStorage.setItem("openai_api_key_last_validated", new Date().toISOString())
}

// Clear API key and related data
export function clearApiKey(): void {
  localStorage.removeItem("openai_api_key")
  localStorage.removeItem("openai_api_key_valid")
  localStorage.removeItem("openai_api_key_last_validated")
}

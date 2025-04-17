import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, model = "gpt-4o" } = await req.json()

    // Get API key from request headers
    const apiKey = req.headers.get("x-api-key")

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key is required" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Token optimization - if conversation is too long, summarize or truncate
    const processedMessages = messages.length > 20 ? [...messages.slice(0, 1), ...messages.slice(-19)] : messages

    // Log that we're making a request (for debugging)
    console.log(`Making request to OpenAI with model: ${model}`)

    const result = streamText({
      model: openai(model, { apiKey }),
      messages: processedMessages,
      temperature: 0.7,
      maxTokens: 2000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response(
      JSON.stringify({
        error: "An error occurred while generating the response",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

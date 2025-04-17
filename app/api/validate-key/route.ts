export async function POST(req: Request) {
  try {
    // Get API key from request headers
    const apiKey = req.headers.get("x-api-key")

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key is required" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Make a lightweight request to OpenAI to validate the API key
    // We'll use the models endpoint as it's lightweight and doesn't consume tokens
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return new Response(
        JSON.stringify({
          valid: false,
          error: errorData.error?.message || "Invalid API key",
          status: response.status,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // If we get here, the API key is valid
    const data = await response.json()
    const gpt4Models = data.data.filter((model: any) => model.id.includes("gpt-4") || model.id.includes("gpt-3.5"))

    return new Response(
      JSON.stringify({
        valid: true,
        model: gpt4Models.length > 0 ? gpt4Models[0].id : "Unknown model",
        models: gpt4Models.map((m: any) => m.id),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("Error validating API key:", error)
    return new Response(
      JSON.stringify({
        valid: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

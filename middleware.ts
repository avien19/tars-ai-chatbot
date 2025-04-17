import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Only apply to /api/chat route
  if (request.nextUrl.pathname.startsWith("/api/chat")) {
    // Get API key from local storage on client side
    const apiKey = request.cookies.get("openai-api-key")?.value

    // Create a new response
    const response = NextResponse.next()

    // If API key exists in cookies, add it to the headers
    if (apiKey) {
      response.headers.set("x-api-key", apiKey)
    } else {
      // Try to get from localStorage via client-side JS
      response.headers.set("x-use-client-key", "true")
    }

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/api/:path*",
}

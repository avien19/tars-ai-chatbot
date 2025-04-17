import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import Script from "next/script"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TARS",
  description: "An AI chatbot",
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Script id="api-key-handler" strategy="afterInteractive">
          {`
            // Intercept fetch requests to add API key from localStorage
            const originalFetch = window.fetch;
            window.fetch = async function(url, options = {}) {
              if (url === '/api/chat' || url.toString().startsWith('/api/chat?')) {
                const apiKey = localStorage.getItem('openai_api_key');
                if (apiKey) {
                  options.headers = {
                    ...options.headers,
                    'x-api-key': apiKey
                  };
                  console.log('Added API key to request headers');
                } else {
                  console.warn('No API key found in localStorage');
                }
              }
              return originalFetch(url, options);
            };
          `}
        </Script>
      </body>
    </html>
  )
}


import './globals.css'
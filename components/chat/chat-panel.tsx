"use client"

import type React from "react"
import type { FormEvent } from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendIcon, StopCircle, Sparkles, Mic, Paperclip, ShieldAlert } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import PromptSuggestions from "./prompt-suggestions"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ChatPanelProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  error?: Error | null
  apiKeyStatus?: "missing" | "stored" | "invalid"
  onOpenApiDialog?: () => void
}

export default function ChatPanel({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  error,
  apiKeyStatus = "stored",
  onOpenApiDialog,
}: ChatPanelProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Auto-focus textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  // Update the onSubmit function to only check for missing/invalid keys
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    // Only block submission if API key is missing or invalid
    if (apiKeyStatus === "missing" || apiKeyStatus === "invalid") {
      if (onOpenApiDialog) {
        onOpenApiDialog()
      }
      return
    }

    handleSubmit(e)
  }

  return (
    <div className="relative">
      {/* Decorative elements */}
      <div className="absolute -top-6 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="p-4 pt-2 border-t border-border/40 bg-background/80 backdrop-blur-sm rounded-b-xl">
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-4"
            >
              <PromptSuggestions
                onSelectPrompt={(prompt) => {
                  handleInputChange({ target: { value: prompt } } as React.ChangeEvent<HTMLTextAreaElement>)
                  setShowSuggestions(false)
                  if (textareaRef.current) {
                    textareaRef.current.focus()
                  }
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {(apiKeyStatus === "missing" || apiKeyStatus === "invalid") && (
          <Alert variant={apiKeyStatus === "invalid" ? "destructive" : "default"} className="mb-4">
            <ShieldAlert className="h-4 w-4" />
            <AlertDescription>
              {apiKeyStatus === "missing"
                ? "Please add your OpenAI API key in settings to start chatting"
                : "Your API key appears to be invalid. Please update it in settings."}{" "}
              <Button variant="link" className="p-0 h-auto text-sm underline" onClick={onOpenApiDialog}>
                Open settings
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <div
            className={cn(
              "relative flex items-end rounded-lg border transition-all overflow-hidden",
              isFocused ? "border-indigo-500 shadow-[0_0_0_1px_rgba(124,58,237,0.3)]" : "border-input",
            )}
          >
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              placeholder="Message Cosmic AI..."
              className="min-h-24 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pr-20"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  const form = e.currentTarget.form
                  if (form && input.trim()) {
                    form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
                  }
                }
              }}
            />

            <div className="absolute bottom-2 right-2 flex items-center gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  >
                    <Paperclip className="h-4 w-4" />
                    <span className="sr-only">Attach files</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="top" className="w-60">
                  <div className="text-sm font-medium mb-2">Coming soon!</div>
                  <p className="text-xs text-muted-foreground">
                    File upload support will be available in the next update.
                  </p>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  >
                    <Mic className="h-4 w-4" />
                    <span className="sr-only">Voice input</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="top" className="w-60">
                  <div className="text-sm font-medium mb-2">Coming soon!</div>
                  <p className="text-xs text-muted-foreground">Voice input will be available in the next update.</p>
                </PopoverContent>
              </Popover>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
                onClick={() => setShowSuggestions(!showSuggestions)}
              >
                <Sparkles className="h-4 w-4" />
                <span className="sr-only">Show suggestions</span>
              </Button>
            </div>
          </div>

          {error && apiKeyStatus === "stored" && (
            <Alert variant="destructive" className="py-2">
              <AlertDescription>{error.message || "Failed to send message. Please try again."}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end">
            {isLoading ? (
              <Button variant="destructive" type="button" onClick={() => window.location.reload()} className="px-6">
                <StopCircle className="w-4 h-4 mr-2" />
                Stop generating
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!input.trim() || apiKeyStatus === "missing" || apiKeyStatus === "invalid"}
                className="bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white px-6"
              >
                <SendIcon className="w-4 h-4 mr-2" />
                Send message
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

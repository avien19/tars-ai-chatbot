"use client"

import { Button } from "@/components/ui/button"
import { PROMPT_SUGGESTIONS } from "@/lib/constants"
import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface PromptSuggestionsProps {
  onSelectPrompt?: (prompt: string) => void
}

export default function PromptSuggestions({ onSelectPrompt }: PromptSuggestionsProps) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-3 flex items-center">
        <Sparkles className="w-4 h-4 mr-1 text-indigo-500" />
        Try asking:
      </p>
      <div className="flex flex-wrap gap-2">
        {PROMPT_SUGGESTIONS.map((suggestion, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-background/50 backdrop-blur-sm border-border/40 hover:bg-muted/50 hover:text-primary transition-colors"
              onClick={() => onSelectPrompt && onSelectPrompt(suggestion)}
            >
              {suggestion}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

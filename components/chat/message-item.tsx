"use client"

import type { Message } from "ai"
import { Copy, Check, User, Bot, Share2, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MessageItemProps {
  message: Message
}

export default function MessageItem({ message }: MessageItemProps) {
  const [copied, setCopied] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  const isUser = message.role === "user"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex gap-3 max-w-[85%] group", isUser ? "flex-row-reverse" : "flex-row")}>
        <motion.div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
            isUser ? "bg-gradient-to-r from-pink-500 to-indigo-500" : "bg-gradient-to-r from-indigo-500 to-purple-500",
          )}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
        </motion.div>

        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-md",
            isUser
              ? "bg-gradient-to-r from-pink-500 to-indigo-500 text-white"
              : "bg-background border border-border/40",
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="text-sm font-medium mb-1">{isUser ? "You" : "TARS"}</div>
            {!isUser && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() => setBookmarked(!bookmarked)}
                      >
                        <Bookmark className={cn("h-3 w-3", bookmarked ? "fill-yellow-500 text-yellow-500" : "")} />
                        <span className="sr-only">Bookmark</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>{bookmarked ? "Remove bookmark" : "Bookmark"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                        <Share2 className="h-3 w-3" />
                        <span className="sr-only">Share</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Share</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-6 w-6 rounded-full", copied ? "text-green-500" : "")}
                        onClick={copyToClipboard}
                      >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        <span className="sr-only">Copy message</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>{copied ? "Copied!" : "Copy"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>

          <div className={cn("prose prose-sm max-w-none", isUser ? "prose-invert" : "")}>
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "")
                  return !inline && match ? (
                    <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}

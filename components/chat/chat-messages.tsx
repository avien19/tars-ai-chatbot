"use client"

import { useRef, useEffect } from "react"
import type { Message } from "ai"
import { Loader2, Sparkles } from "lucide-react"
import MessageItem from "./message-item"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
// Remove the Lottie import and animation data
// import Lottie from "lottie-react"
// import robotAnimation from "@/animations/robot-animation.json"

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  error: Error | null
}

export default function ChatMessages({ messages, isLoading, error }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-indigo-500/50 scrollbar-track-transparent">
      {messages.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center h-full text-center p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Replace the Lottie animation div with a simple animated icon */}
          {/* <div className="w-48 h-48 mb-6">
            <Lottie animationData={robotAnimation} loop={true} />
          </div> */}
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-indigo-500 flex items-center justify-center mb-6"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>

          <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
            How can I help?
          </h3>

          <p className="text-muted-foreground max-w-md mb-8">
            Your personal AI assistant with privacy, customization, and control.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
            <motion.div
              className="bg-muted/50 backdrop-blur-sm p-4 rounded-xl border border-border/40"
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-indigo-500 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-medium mb-1">Your Data, Your Control</h4>
              <p className="text-sm text-muted-foreground">No data collection or training on your conversations</p>
            </motion.div>

            <motion.div
              className="bg-muted/50 backdrop-blur-sm p-4 rounded-xl border border-border/40"
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-indigo-500 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-medium mb-1">No Subscription</h4>
              <p className="text-sm text-muted-foreground">Use your own API key with pay-as-you-go pricing</p>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <MessageItem message={message} />
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              className="flex items-center justify-center py-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center space-x-2 bg-muted/50 backdrop-blur-sm py-2 px-4 rounded-full">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                <span className="text-sm font-medium">AI is thinking...</span>
              </div>
            </motion.div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>An error occurred while generating a response. Please try again.</AlertDescription>
            </Alert>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  )
}

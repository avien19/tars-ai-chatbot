"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import ChatPanel from "@/components/chat/chat-panel"
import ChatMessages from "@/components/chat/chat-messages"
import ChatHistory from "@/components/chat/chat-history"
import ModelSelector from "@/components/chat/model-selector"
import { PlusCircle, MessageSquareText, Settings, Info, Sparkles, ShieldAlert } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ApiKeyDialog from "@/components/api-key-dialog"
import FeatureShowcase from "@/components/feature-showcase"
import { getApiKeyStatus } from "@/lib/api-key-utils"

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState<string>("new")
  const [savedChats, setSavedChats] = useState<Record<string, any>>({})
  const [showSidebar, setShowSidebar] = useState(true)
  const [showApiDialog, setShowApiDialog] = useState(false)
  const [showFeatures, setShowFeatures] = useState(false)
  const [firstVisit, setFirstVisit] = useState(true)
  const [customInstructions, setCustomInstructions] = useState("")
  const [apiKeyStatus, setApiKeyStatus] = useState<"missing" | "stored" | "invalid">("missing")

  const { messages, input, handleInputChange, handleSubmit, setMessages, isLoading, error, setInput } = useChat({
    id: activeChat === "new" ? undefined : activeChat,
    onError: (error) => {
      console.error("Chat error:", error)
      // Check if the error is related to the API key
      if (error.message?.toLowerCase().includes("api key") || error.message?.toLowerCase().includes("authentication")) {
        setApiKeyStatus("invalid")
        setShowApiDialog(true)
      }
    },
    onFinish: (message) => {
      if (activeChat === "new" && messages.length > 0) {
        const newChatId = Date.now().toString()
        const newChat = {
          id: newChatId,
          title: messages[0].content.substring(0, 30) + "...",
          messages: [...messages, message],
          createdAt: new Date().toISOString(),
        }

        setSavedChats((prev) => ({
          ...prev,
          [newChatId]: newChat,
        }))

        setActiveChat(newChatId)
        localStorage.setItem(
          "savedChats",
          JSON.stringify({
            ...savedChats,
            [newChatId]: newChat,
          }),
        )
      } else if (activeChat !== "new") {
        const updatedChat = {
          ...savedChats[activeChat],
          messages: [...messages, message],
        }

        setSavedChats((prev) => ({
          ...prev,
          [activeChat]: updatedChat,
        }))

        localStorage.setItem(
          "savedChats",
          JSON.stringify({
            ...savedChats,
            [activeChat]: updatedChat,
          }),
        )
      }
    },
  })

  useEffect(() => {
    const storedChats = localStorage.getItem("savedChats")
    if (storedChats) {
      setSavedChats(JSON.parse(storedChats))
    }

    // Check API key status
    const status = getApiKeyStatus()
    setApiKeyStatus(status)

    // Only show API dialog if key is missing (not if invalid)
    if (status === "missing") {
      setShowApiDialog(true)
    }

    // Load custom instructions
    const storedInstructions = localStorage.getItem("custom_instructions")
    if (storedInstructions) {
      setCustomInstructions(storedInstructions)
    }

    // Check if first visit
    const visited = localStorage.getItem("cosmic_visited")
    if (!visited) {
      setShowFeatures(true)
      localStorage.setItem("cosmic_visited", "true")
    } else {
      setFirstVisit(false)
    }
  }, [])

  const handleCustomInstructionsChange = (instructions: string) => {
    setCustomInstructions(instructions)
    localStorage.setItem("custom_instructions", instructions)
  }

  const startNewChat = () => {
    setActiveChat("new")
    setMessages([])
    setInput("")
  }

  const loadChat = (chatId: string) => {
    setActiveChat(chatId)
    setMessages(savedChats[chatId].messages)
  }

  const deleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const { [chatId]: _, ...remainingChats } = savedChats
    setSavedChats(remainingChats)
    localStorage.setItem("savedChats", JSON.stringify(remainingChats))

    if (activeChat === chatId) {
      startNewChat()
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background via-background to-background/90">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b backdrop-blur-md bg-background/60">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={() => setShowSidebar(!showSidebar)}>
            <MessageSquareText className="w-5 h-5" />
          </Button>
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-6 h-6 mr-2 text-indigo-500" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
              TARS
            </h1>
          </motion.div>
        </div>
        <div className="flex items-center gap-2">
          {apiKeyStatus === "invalid" && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 border-red-500 hover:bg-red-500/10 flex items-center gap-1"
              onClick={() => setShowApiDialog(true)}
            >
              <ShieldAlert className="w-4 h-4" />
              <span className="hidden sm:inline">Invalid API Key</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setShowFeatures(true)}
          >
            <Info className="w-5 h-5" />
          </Button>
          <ModelSelector />
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setShowApiDialog(true)}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.div
          className="hidden md:flex flex-col w-64 border-r bg-background/50 backdrop-blur-md"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4">
            <Button
              onClick={startNewChat}
              className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 shadow-lg hover:shadow-pink-500/20"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-2">
            <ChatHistory chats={savedChats} activeChat={activeChat} onSelectChat={loadChat} onDeleteChat={deleteChat} />
          </div>
        </motion.div>

        {/* Mobile sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              className="absolute inset-0 z-40 md:hidden"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSidebar(false)} />
              <div className="absolute top-0 left-0 bottom-0 w-64 bg-background border-r">
                <div className="p-4">
                  <Button
                    onClick={() => {
                      startNewChat()
                      setShowSidebar(false)
                    }}
                    className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 shadow-lg hover:shadow-pink-500/20"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    New Chat
                  </Button>
                </div>
                <div className="flex-1 overflow-auto p-2">
                  <ChatHistory
                    chats={savedChats}
                    activeChat={activeChat}
                    onSelectChat={(id) => {
                      loadChat(id)
                      setShowSidebar(false)
                    }}
                    onDeleteChat={deleteChat}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main chat area */}
        <motion.div
          className="flex-1 flex flex-col overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col h-full max-w-4xl mx-auto w-full p-4">
            <Card className="flex flex-col flex-1 overflow-hidden border-none shadow-xl bg-background/60 backdrop-blur-md">
              <ChatMessages messages={messages} isLoading={isLoading} error={error} />
              <ChatPanel
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
                apiKeyStatus={apiKeyStatus}
                onOpenApiDialog={() => setShowApiDialog(true)}
              />
            </Card>
          </div>
        </motion.div>
      </main>

      <ApiKeyDialog
        open={showApiDialog}
        onOpenChange={setShowApiDialog}
        customInstructions={customInstructions}
        onCustomInstructionsChange={handleCustomInstructionsChange}
      />
      <FeatureShowcase open={showFeatures} onOpenChange={setShowFeatures} />
    </div>
  )
}

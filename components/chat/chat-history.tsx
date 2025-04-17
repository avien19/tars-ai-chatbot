"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, Trash2, Search, Calendar, SortAsc, SortDesc } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ChatHistoryProps {
  chats: Record<string, any>
  activeChat: string
  onSelectChat: (chatId: string) => void
  onDeleteChat: (chatId: string, e: React.MouseEvent) => void
}

export default function ChatHistory({ chats, activeChat, onSelectChat, onDeleteChat }: ChatHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

  const chatIds = Object.keys(chats)

  const filteredAndSortedChats = chatIds
    .filter((id) => {
      if (!searchTerm) return true
      return chats[id].title.toLowerCase().includes(searchTerm.toLowerCase())
    })
    .sort((a, b) => {
      const dateA = new Date(chats[a].createdAt || 0).getTime()
      const dateB = new Date(chats[b].createdAt || 0).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

  if (chatIds.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <MessageSquare className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No chat history</h3>
        <p className="text-muted-foreground mt-2">Start a new conversation to see it here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          className="pl-9 bg-background/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredAndSortedChats.length} {filteredAndSortedChats.length === 1 ? "conversation" : "conversations"}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              {sortOrder === "newest" ? <SortDesc className="h-3.5 w-3.5" /> : <SortAsc className="h-3.5 w-3.5" />}
              <span className="sr-only md:not-sr-only md:text-xs">
                {sortOrder === "newest" ? "Newest first" : "Oldest first"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortOrder("newest")}>
              <SortDesc className="mr-2 h-4 w-4" />
              Newest first
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
              <SortAsc className="mr-2 h-4 w-4" />
              Oldest first
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3">
        {filteredAndSortedChats.map((chatId, index) => (
          <motion.div
            key={chatId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                activeChat === chatId
                  ? "border-indigo-500 bg-gradient-to-r from-pink-500/10 to-indigo-500/10"
                  : "hover:bg-muted/50",
              )}
              onClick={() => onSelectChat(chatId)}
            >
              <div className="p-3">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-medium truncate">{chats[chatId].title}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => onDeleteChat(chatId, e)}
                    className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 hover:opacity-100 hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    <span>{chats[chatId].messages.length} messages</span>
                  </div>

                  {chats[chatId].createdAt && (
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{format(new Date(chats[chatId].createdAt), "MMM d, yyyy")}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

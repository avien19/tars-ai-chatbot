"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Sparkles, Lock, Cpu, Download, Palette, MessageSquare, FileText, Zap, Rocket } from "lucide-react"

interface FeatureShowcaseProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function FeatureShowcase({ open, onOpenChange }: FeatureShowcaseProps) {
  const [activeTab, setActiveTab] = useState("why")

  const features = [
    {
      icon: <Lock className="h-5 w-5 text-green-500" />,
      title: "Complete Privacy",
      description: "Your conversations stay on your device. No data collection or training on your prompts.",
    },
    {
      icon: <Cpu className="h-5 w-5 text-indigo-500" />,
      title: "Model Control",
      description: "Switch between different AI models anytime. Use the latest or most cost-effective options.",
    },
    {
      icon: <Download className="h-5 w-5 text-purple-500" />,
      title: "Save & Export",
      description: "Save all your conversations locally and export them in various formats.",
    },
    {
      icon: <Palette className="h-5 w-5 text-pink-500" />,
      title: "Customizable UI",
      description: "Personalize the interface with themes and layout options to suit your preferences.",
    },
    {
      icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
      title: "Custom Instructions",
      description: "Set persistent instructions that apply to all your conversations.",
    },
    {
      icon: <FileText className="h-5 w-5 text-amber-500" />,
      title: "File Analysis",
      description: "Upload and analyze documents, images, and code files (coming soon).",
    },
    {
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      title: "No Subscription",
      description: "Use your own API key. Pay only for what you use with no monthly fees.",
    },
    {
      icon: <Rocket className="h-5 w-5 text-red-500" />,
      title: "Self-Hostable",
      description: "Deploy on your own server for complete control and customization.",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl overflow-hidden p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-500" />
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
              Why Use TARS?
            </span>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="why">Why Cosmic AI?</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="coming">Coming Soon</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="why" className="mt-0 p-6 pt-4">
            <div className="space-y-4">
              <p className="text-lg">
                Unlike ChatGPT, TARS gives you <span className="font-semibold text-indigo-500">complete control</span>{" "}
                over your AI experience:
              </p>

              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-green-500/10 p-1 mt-0.5">
                    <Sparkles className="h-3 w-3 text-green-500" />
                  </div>
                  <span>
                    <strong>Your Data, Your Control</strong> - No data collection or training on your conversations
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-indigo-500/10 p-1 mt-0.5">
                    <Sparkles className="h-3 w-3 text-indigo-500" />
                  </div>
                  <span>
                    <strong>Your API Key</strong> - Use your own OpenAI account with your own rate limits
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-pink-500/10 p-1 mt-0.5">
                    <Sparkles className="h-3 w-3 text-pink-500" />
                  </div>
                  <span>
                    <strong>No Subscription</strong> - Pay only for what you use with OpenAI's pay-as-you-go pricing
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-purple-500/10 p-1 mt-0.5">
                    <Sparkles className="h-3 w-3 text-purple-500" />
                  </div>
                  <span>
                    <strong>Full Customization</strong> - Personalize the UI, models, and behavior to your needs
                  </span>
                </li>
              </ul>

              <div className="bg-muted/50 p-4 rounded-lg mt-6">
                <p className="text-sm text-muted-foreground">
                  "TARS is for those who want the power of advanced AI with the freedom of complete control and
                  privacy."
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-6 pt-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="border border-border/40 rounded-lg p-4 bg-background/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-muted/50 p-2">{feature.icon}</div>
                    <div>
                      <h3 className="font-medium">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="coming" className="mt-0 p-6 pt-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                  Voice Conversations
                </h3>
                <p className="text-muted-foreground">
                  Talk to your AI assistant naturally with voice input and output. Perfect for hands-free use.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-pink-500" />
                  Image Generation
                </h3>
                <p className="text-muted-foreground">
                  Create images from text descriptions using DALL-E and other image generation models.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Knowledge Base Integration
                </h3>
                <p className="text-muted-foreground">
                  Connect your documents, websites, and data sources to give the AI context about your specific needs.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Plugin Ecosystem
                </h3>
                <p className="text-muted-foreground">
                  Extend functionality with plugins for specific tasks like web search, code execution, and more.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="p-6 pt-2 flex justify-end border-t">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white"
          >
            Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

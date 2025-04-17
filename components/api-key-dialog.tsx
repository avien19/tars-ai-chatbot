"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle, Key, MessageSquare, Loader2, ShieldAlert, ShieldCheck } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { isValidApiKeyFormat, testApiKey, storeApiKey, clearApiKey } from "@/lib/api-key-utils"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ApiKeyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customInstructions?: string
  onCustomInstructionsChange?: (instructions: string) => void
}

export default function ApiKeyDialog({
  open,
  onOpenChange,
  customInstructions = "",
  onCustomInstructionsChange = () => {},
}: ApiKeyDialogProps) {
  const [apiKey, setApiKey] = useState("")
  const [savedKey, setSavedKey] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("api-key")
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{
    valid: boolean
    error?: string
    model?: string
  } | null>(null)

  useEffect(() => {
    const storedKey = localStorage.getItem("openai_api_key")
    if (storedKey) {
      setSavedKey(storedKey)
      setApiKey("sk-•••••••••••••••••••••••••••••••")
    }
  }, [open])

  const validateAndSaveApiKey = async (key: string) => {
    setIsValidating(true)
    setError("")
    setSuccess(false)

    try {
      // First check the format
      if (!isValidApiKeyFormat(key)) {
        setError("Invalid API key format. It should start with 'sk-' and be at least 20 characters long.")
        setIsValidating(false)
        return false
      }

      // Then test the API key with OpenAI
      const result = await testApiKey(key)
      setValidationResult(result)

      if (!result.valid) {
        setError(result.error || "Invalid API key. Please check your key and try again.")
        setIsValidating(false)
        return false
      }

      // If valid, store the key
      storeApiKey(key, true)
      setSavedKey(key)
      setSuccess(true)

      setTimeout(() => {
        setSuccess(false)
      }, 3000)

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      return false
    } finally {
      setIsValidating(false)
    }
  }

  const handleSave = async () => {
    if (activeTab === "api-key") {
      if (!apiKey.trim()) {
        setError("API key is required")
        return
      }

      // If the key is masked (already saved), just show success
      if (apiKey === "sk-•••••••••••••••••••••••••••••••" && savedKey) {
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
        }, 1500)
        return
      }

      // Otherwise validate and save the new key
      const isValid = await validateAndSaveApiKey(apiKey)
      if (isValid) {
        // Reload the page to apply the new API key
        // window.location.reload();
      }
    } else if (activeTab === "instructions") {
      onCustomInstructionsChange(customInstructions)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
      }, 1500)
    }
  }

  const handleClear = () => {
    if (activeTab === "api-key") {
      clearApiKey()
      setApiKey("")
      setSavedKey(null)
      setValidationResult(null)
    } else if (activeTab === "instructions") {
      onCustomInstructionsChange("")
    }
    setSuccess(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Configure your Cosmic AI experience</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="api-key" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Key
            </TabsTrigger>
            <TabsTrigger value="instructions" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Instructions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api-key" className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="api-key">OpenAI API Key</Label>
                {savedKey && validationResult?.valid && (
                  <div className="flex items-center text-green-500 text-xs">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Valid key
                  </div>
                )}
                {savedKey && validationResult?.valid === false && (
                  <div className="flex items-center text-red-500 text-xs">
                    <ShieldAlert className="h-3 w-3 mr-1" />
                    Invalid key
                  </div>
                )}
              </div>

              <Input
                id="api-key"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value)
                  setError("")
                  setSuccess(false)
                  setValidationResult(null)
                }}
                className={validationResult?.valid ? "border-green-500 focus-visible:ring-green-500" : ""}
              />

              {error && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && activeTab === "api-key" && (
                <div className="flex items-center text-green-500 text-sm mt-1">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  API key validated and saved successfully!
                </div>
              )}

              {validationResult?.valid && validationResult.model && (
                <div className="text-xs text-muted-foreground mt-1">
                  Detected model: <span className="font-medium">{validationResult.model}</span>
                </div>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                You can get your API key from the{" "}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primary"
                >
                  OpenAI dashboard
                </a>
                .
              </p>
              <p className="mt-2">
                This key is stored only in your browser's local storage and is used to make requests to OpenAI's API.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="instructions" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="custom-instructions">Custom Instructions</Label>
              <Textarea
                id="custom-instructions"
                placeholder="Add instructions that the AI should follow in all conversations..."
                value={customInstructions}
                onChange={(e) => onCustomInstructionsChange(e.target.value)}
                className="min-h-32"
              />
              {success && activeTab === "instructions" && (
                <div className="flex items-center text-green-500 text-sm mt-1">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Instructions saved successfully!
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Custom instructions will be applied to all your conversations. For example:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Always explain concepts as if I'm a beginner</li>
                <li>Include code examples when explaining technical concepts</li>
                <li>Be concise and to the point in your responses</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between sm:justify-between">
          {((activeTab === "api-key" && savedKey) || (activeTab === "instructions" && customInstructions)) && (
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          )}
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white"
            disabled={isValidating}
          >
            {isValidating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

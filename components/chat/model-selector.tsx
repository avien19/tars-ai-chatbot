"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MODELS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function ModelSelector() {
  const [open, setOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState(MODELS[0])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[180px] justify-between border-border/40 bg-background/50 backdrop-blur-sm hidden md:flex"
        >
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            <span>{selectedModel.name}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <Command>
          <CommandInput placeholder="Search models..." />
          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>
            <CommandGroup>
              {MODELS.map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.name}
                  onSelect={() => {
                    setSelectedModel(model)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedModel.id === model.id ? "opacity-100 text-indigo-500" : "opacity-0",
                        )}
                      />
                      <span>{model.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {model.badge && (
                        <Badge variant="outline" className="text-xs font-normal">
                          {model.badge}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">{model.description}</span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

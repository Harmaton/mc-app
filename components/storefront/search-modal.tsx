"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export function SearchModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative md:hidden">
          <Search className="h-5 w-5 transition-colors hover:text-primary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-screen overflow-y-auto p-0 border-none bg-background shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center">
            <Search className="h-5 w-5 text-muted-foreground mr-2" />
            <Input
              type="text"
              placeholder="Search for products, categories..."
              autoFocus
              className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-lg"
              onKeyDown={(e) => {
                if (e.key === "Escape") setOpen(false)
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Results Placeholder */}
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium">Start typing to search</h3>
            <p className="text-muted-foreground max-w-xs">
              Search our curated collection of handcrafted bags, accessories, and more.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { ShoppingCart, X } from "lucide-react"
import { formatCurrency } from "@/utils/format-currency"
import { useCart } from "@/providers/cart-provider"

export function CartSheet() {
  const [open, setOpen] = useState(false)
  const { items, getTotalItems, getTotalPrice } = useCart()

  if (items.length === 0) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full max-w-md overflow-y-auto p-6">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <SheetTitle className="text-2xl font-bold">Your Cart</SheetTitle>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <ShoppingCart className="h-16 w-16 text-gray-300" />
              <p className="text-gray-500">Your cart is empty</p>
              <Link href="/products">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group">
          <ShoppingCart className="h-5 w-5 transition-colors group-hover:text-primary" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {getTotalItems()}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto p-6 bg-background">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <SheetTitle className="text-2xl font-bold tracking-tight">Your Cart</SheetTitle>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-4 p-3 rounded-lg bg-card border border-border">
                <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm leading-tight truncate">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{item.price ? formatCurrency(item.price) : "Price unavailable"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                </div>
                <div className="flex items-end">
                  <span className="font-medium text-sm">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-6 space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatCurrency(getTotalPrice())}</span>
            </div>
            <Button className="w-full bg-gradient-to-r from-lavender-600 to-lavender-700 hover:from-lavender-700 hover:to-lavender-800 text-white">
              Proceed to Checkout
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
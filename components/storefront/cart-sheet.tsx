"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
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
          <Button
            variant="ghost"
            size="icon"
            className="relative group hover:bg-lavender-50 transition-colors duration-200 p-0 w-10 h-10"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5 text-gray-700 group-hover:text-lavender-600 transition-colors" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5  rounded-full bg-lavender-600 text-xs text-black flex items-center justify-center shadow-lg ring-1 ring-lavender-200">
                {getTotalItems()}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full max-w-md overflow-y-auto p-6 bg-white border-l-0 shadow-xl"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-8 pt-2">
              <SheetTitle className="text-2xl font-bold text-gray-900 tracking-tight">Your Cart</SheetTitle>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-8">
              <ShoppingCart className="h-16 w-16 text-lavender-300" />
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <Link href="/products">
                <Button
                  variant="default"
                  className="bg-gradient-to-r from-lavender-600 to-purple-600 hover:from-lavender-700 hover:to-purple-700 text-white px-8 py-3 font-medium shadow-sm"
                >
                  Continue Shopping
                </Button>
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
        <Button
          variant="ghost"
          size="icon"
          className="relative group hover:bg-lavender-50 transition-colors duration-200 p-0 w-10 h-10"
          aria-label="Open cart"
        >
          <ShoppingCart className="h-5 w-5 text-gray-700 group-hover:text-lavender-600 transition-colors" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-lavender-600 text-xs text-black flex items-center justify-center shadow-lg ring-1 ring-lavender-200">
              {getTotalItems()}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full max-w-md overflow-y-auto p-6 bg-white border-l-0 shadow-xl"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6 pt-2">
            <SheetTitle className="text-2xl font-bold text-gray-900 tracking-tight">Your Cart</SheetTitle>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-sm transition-all duration-200"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm leading-tight text-gray-900 truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {item.price ? formatCurrency(item.price) : "Price unavailable"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                </div>
                <div className="flex items-end">
                  <span className="font-semibold text-sm text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-4">
            <div className="flex justify-between text-lg font-semibold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(getTotalPrice())}</span>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-lavender-600 to-purple-600 hover:from-lavender-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              asChild
            >
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>

            <Button
              variant="outline"
              className="w-full border-gray-200 text-gray-700 hover:bg-lavender-50 hover:text-lavender-600 font-medium transition-colors"
              onClick={() => setOpen(false)}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
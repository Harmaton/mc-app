"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, User, ShoppingCart } from "lucide-react"
import { useCart } from "./cart-provider"
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react"
import { SignInButton, UserButton } from "@clerk/nextjs"
import Image from "next/image"

export function StorefrontNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, getTotalItems } = useCart()

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/logo-white.png"
              alt="Storefront Logo"
              width={100}
              height={100}
              className="h-8 w-8"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Search className="h-4 w-4" />
            </Button>

            {/* Authentication */}
            <Authenticated>
              <UserButton />
            </Authenticated>
            <AuthLoading>
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            </AuthLoading>
            <Unauthenticated>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </SignInButton>
            </Unauthenticated>

            {/* Cart */}
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-4 w-4" />
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">{getTotalItems()}</Badge>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-sm font-medium transition-colors hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="border-t pt-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                    <Authenticated>
                      <div className="px-3 py-2">
                        <UserButton />
                      </div>
                    </Authenticated>
                    <AuthLoading>
                      <div className="px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                      </div>
                    </AuthLoading>
                    <Unauthenticated>
                      <SignInButton mode="modal">
                        <Button variant="ghost" className="w-full justify-start">
                          <User className="h-4 w-4 mr-2" />
                          Sign In
                        </Button>
                      </SignInButton>
                    </Unauthenticated>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

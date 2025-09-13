"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, Search, User, ShoppingCart } from "lucide-react"
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react"
import { SignInButton, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { SearchModal } from "./search-modal"
import { CartSheet } from "./cart-sheet"

export function StorefrontNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/logo-white.png"
              alt="MillCarry Logo"
              width={100}
              height={100}
              className="h-8 w-8 object-contain"
            />
            <span className="hidden md:inline text-xl font-bold bg-gradient-to-r from-lavender-600 to-purple-600 bg-clip-text text-transparent">
              MillCarry
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-lavender-600 transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-lavender-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Mobile Search Modal */}
            <SearchModal />

            {/* Desktop Search Button */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex bg-transparent hover:bg-muted/50 text-gray-700"
            >
              <Search className="h-4 w-4 mr-1" />
              Search
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
                <Button variant="ghost" size="sm" className="hidden sm:flex bg-transparent hover:bg-muted/50 text-gray-700">
                  <User className="h-4 w-4 mr-1" />
                  Sign In
                </Button>
              </SignInButton>
            </Unauthenticated>

            {/* Cart Sheet */}
            <CartSheet />

            {/* Mobile Menu Trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background">
                <div className="flex flex-col space-y-6 mt-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium transition-colors hover:text-lavender-600 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}

                  <div className="border-t pt-6 space-y-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      <Search className="h-5 w-5 mr-3" />
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
                        <Button variant="ghost" className="w-full justify-start text-lg">
                          <User className="h-5 w-5 mr-3" />
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
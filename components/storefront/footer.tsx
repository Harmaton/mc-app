"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Instagram,  
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Shield, 
  Truck,
  ArrowRight,
  Heart,
  Facebook
} from "lucide-react"

// Note: If TikTok icon isn't in lucide-react yet, add this custom component:
// You can replace it with a simple SVG if needed — here’s the Lucide-style version included below

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-lavender-900/30 to-gray-800 text-white overflow-hidden">
      {/* Optimized SVG Background Pattern — lightweight, subtle, non-bloating */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <g fill="currentColor" stroke="none">
            {/* Subtle bag silhouettes — only 4, spaced out */}
            <path d="M150 180 L150 210 L130 210 L130 220 L170 220 L170 210 L150 210 L150 180 M135 175 L135 185 L165 185 L165 175 L160 175 L160 170 L140 170 L140 175 Z" opacity="0.4"/>
            <path d="M400 300 L400 330 L380 330 L380 340 L420 340 L420 330 L400 330 L400 300 M385 295 L385 305 L415 305 L415 295 L410 295 L410 290 L390 290 L390 295 Z" opacity="0.4"/>
            <path d="M700 200 L700 230 L680 230 L680 240 L720 240 L720 230 L700 230 L700 200 M685 195 L685 205 L715 205 L715 195 L710 195 L710 190 L690 190 L690 195 Z" opacity="0.4"/>
            <path d="M1000 350 L1000 380 L980 380 L980 390 L1020 390 L1020 380 L1000 380 L1000 350 M985 345 L985 355 L1015 355 L1015 345 L1010 345 L1010 340 L990 340 L990 345 Z" opacity="0.4"/>
            
            {/* Delicate handbag outlines */}
            <ellipse cx="250" cy="500" rx="20" ry="12" opacity="0.3"/>
            <rect x="230" y="488" width="40" height="24" rx="4" opacity="0.3"/>
            <path d="M240 478 Q240 474 245 474 L255 474 Q260 474 260 478" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3"/>

            <ellipse cx="950" cy="480" rx="20" ry="12" opacity="0.3"/>
            <rect x="930" y="468" width="40" height="24" rx="4" opacity="0.3"/>
            <path d="M940 458 Q940 454 945 454 L955 454 Q960 454 960 458" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3"/>
          </g>
        </svg>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-white/10">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-lavender-600/20 text-lavender-200 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Mail className="h-4 w-4" />
                Stay Updated
              </div>
              <h3 className="text-3xl font-bold mb-4">Get Exclusive Deals & New Arrivals</h3>
              <p className="text-gray-300 mb-8 text-lg">
                Subscribe to our newsletter and be the first to know about sales, new collections, and style tips.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-lavender-400 focus:ring-lavender-400"
                />
                <Button className="bg-gradient-to-r from-lavender-600 to-lavender-700 hover:from-lavender-700 hover:to-lavender-800 font-semibold px-6">
                  Subscribe <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-lavender-500 to-pink-400 rounded-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 7H16V6C16 4.34 14.66 3 13 3H11C9.34 3 8 4.34 8 6V7H5C4.45 7 4 7.45 4 8S4.45 9 5 9H6V19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V9H19C19.55 9 20 8.55 20 8S19.55 7 19 7ZM10 6C10 5.45 10.45 5 11 5H13C13.55 5 14 5.45 14 6V7H10V6Z" fill="white"/>
                  </svg>
                </div>
                <span className="text-2xl font-bold">MillCarry</span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Where elegance meets everyday carry. Handcrafted bags designed for the modern soul who values quality, craftsmanship, and timeless style.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="h-5 w-5 text-lavender-400" />
                  <span>Nairobi, Kenya — Crafted with care</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="h-5 w-5 text-lavender-400" />
                  <span>+254 723 501 623</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="h-5 w-5 text-lavender-400" />
                  <span>hello@millcarry.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { name: "All Products", href: "/products" },
                  { name: "Categories", href: "/categories" },
                  { name: "Featured Items", href: "/featured" },
                  { name: "New Arrivals", href: "/new" },
                  { name: "Sale", href: "/sale" },
                  { name: "Gift Cards", href: "/gift-cards" }
                ].map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-300 hover:text-lavender-400 transition-colors duration-200 flex items-center group"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service — ALL LINKS TO / */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Customer Service</h4>
              <ul className="space-y-3">
                {[
                  "Contact Us",
                  "Shipping Policy",
                  "Returns & Exchanges",
                  "Size Guide",
                  "FAQ",
                  "Track Order"
                ].map((name) => (
                  <li key={name}>
                    <Link 
                      href="/"
                      className="text-gray-300 hover:text-lavender-400 transition-colors duration-200 flex items-center group"
                    >
                      <span>{name}</span>
                      <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social & Trust Badges — IG + TikTok Only */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Connect With Us</h4>
              <div className="flex gap-4 mb-6">
                {[
                  { icon: Instagram, label: "Instagram" },
                  { icon: Facebook, label: "TikTok" }
                ].map(({ icon: Icon, label }) => (
                  <Link 
                    key={label}
                    href="#"
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-300 hover:text-lavender-400 hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <Truck className="h-5 w-5 text-lavender-400" />
                  <span className="text-sm">Free Shipping Over $100</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Shield className="h-5 w-5 text-lavender-400" />
                  <span className="text-sm">Secure Checkout</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <CreditCard className="h-5 w-5 text-lavender-400" />
                  <span className="text-sm">Multiple Payment Options</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Heart className="h-5 w-5 text-lavender-400" />
                  <span className="text-sm">Love It or Return It</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-8 mt-16">
          <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
            <p>
              © {new Date().getFullYear()} MillCarry. All rights reserved. 
              <span className="mx-2">•</span>
              Crafted in Nairobi. Carried with pride.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

// 🔹 Custom TikTok Icon (if not available in lucide-react)
// You can safely remove this if you've added it via lucide-react v0.30+
// Otherwise, paste this into a separate file like `icons/TikTok.tsx` and import it as above
/*
export function TikTok({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 5.03a3.93 3.93 0 0 0-.48-1.53A2.84 2.84 0 0 0 18.04 2c-.93 0-1.75.54-2.18 1.36A2.64 2.64 0 0 0 15.15 4h-.03c-.12 0-.23-.01-.35-.01a2.84 2.84 0 0 0-2.78 2.18c-.1.4-.17.8-.2 1.21v.02c-.01.23-.02.46-.02.7v.02c0 .5.07 1 .2 1.47.25.86.86 1.6 1.7 2.06.16.08.33.15.5.22v.03c.23.1.47.19.73.26.48.14.99.2 1.5.2.5 0 .99-.06 1.47-.2.26-.07.5-.16.73-.26v-.03c.17-.07.34-.14.5-.22.84-.46 1.45-1.2 1.7-2.06.13-.47.2-.97.2-1.47v-.02c0-.28 0-.55-.02-.82-.01-.18-.03-.35-.07-.52a3.93 3.93 0 0 0-.48-1.53zm-1.75 5.54c-.02.15-.06.29-.12.42a1.5 1.5 0 0 1-.48.56c-.15.1-.32.17-.5.2a1.5 1.5 0 0 1-.72.17c-.3 0-.58-.09-.8-.26-.22-.16-.37-.37-.44-.6-.07-.23-.09-.48-.07-.73.02-.25.08-.49.18-.7.11-.22.27-.39.46-.51.2-.12.42-.18.65-.18.2 0 .39.04.56.12.17.08.31.2.41.35.1.15.16.33.18.52.02.19.01.38-.03.56-.04.18-.12.34-.23.47-.11.13-.25.23-.41.28-.16.05-.34.06-.52.03-.18-.03-.34-.1-.47-.22-.13-.12-.2-.27-.2-.43 0-.16.05-.31.15-.42.1-.11.23-.18.38-.2.15-.02.3.01.42.08.12.07.21.18.26.31.05.13.05.28.01.42-.04.14-.13.25-.25.32-.12.07-.27.1-.42.08-.15-.02-.28-.09-.37-.21-.09-.12-.14-.27-.14-.43 0-.16.04-.31.12-.44.08-.13.2-.23.34-.28.14-.05.3-.05.45 0 .15.05.28.14.38.27.1.13.15.29.15.46 0 .17-.05.33-.15.46-.1.13-.23.22-.38.26-.15.04-.31.04-.46 0-.15-.04-.28-.13-.38-.26-.1-.13-.15-.29-.15-.46 0-.17.05-.33.15-.46.1-.13.23-.22.38-.26.15-.04.31-.04.46 0 .15.04.28.13.38.26.1.13.15.29.15.46 0 .17-.05.33-.15.46-.1.13-.23.22-.38.26-.15.04-.31.04-.46 0-.15-.04-.28-.13-.38-.26-.1-.13-.15-.29-.15-.46 0-.17.05-.33.15-.46.1-.13.23-.22.38-.26.15-.04.31-.04.46 0 .15.04.28.13.38.26.1.13.15.29.15.46 0 .17-.05.33-.15.46-.1.13-.23.22-.38.26-.15.04-.31.04-.46 0-.15-.04-.28-.13-.38-.26-.1-.13-.15-.29-.15-.46 0-.17.05-.33.15-.46.1-.13.23-.22.38-.26.15-.04.31-.04.46 0 .15.04.28.13.38.26.1.13.15.29.15.46 0 .17-.05.33-.15.46-.1.13-.23.22-.38.26-.15.04-.31.04-.46 0-.15-.04-.28-.13-.38-.26-.1-.13-.15-.29-.15-.46 0-.17.05-.33.15-.46.1-.13.23-.22.38-.26.15-.04.31-.04.46 0 .15.04.28.13.38.26.1.13.15.29.15.46 0 .17-.05.33-.15.46-.1.13-.23.22-.38.26-.15.04-.31.04-.46 0-.15-.04-.28-.13-.38-.26-.1-.13-.15-.29-.15-.46 0-.17.05-.33.15-.46.1-.13.23-.22.38-.26.15-.04.31-.04.46 0 .15.04.28.13.38.26.1.13.15.29.15.46 0 .17-.05.33-.15.46-.1.13-.23.22-.38.26-.15.04-.31.04-.46 0-.15-.04-.28-.13-.38-.26-.1-.13-.15-.29-.15-.46 0-.17.05-.33.15-.46.1-.13.23-.22.38-.26.15-.04.31-.04.46 0 .15.04.28.13.38.26.1.13.15.29.15.46 0 .17-.05.33-.15.46-.1.13-.23.22-.38.26-.15.04......
    </svg>
  )
}
*/
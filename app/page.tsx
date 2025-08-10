"use client"

import { useQuery } from "convex/react"
import { api } from "../convex/_generated/api"
import { CategoryCarousel } from "@/components/storefront/category-carousel"
import { ProductCard } from "@/components/storefront/product-card"
import { StorefrontNavbar } from "@/components/storefront/navbar"
import { Button } from "@/components/ui/button"
import { ArrowRight, Truck, Shield, Headphones } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const featuredProducts = useQuery(api.productCatalog.listFeatured) || []
  const allProducts = useQuery(api.productCatalog.listActive) || []

  return (
    <div className="min-h-screen">
      <StorefrontNavbar />

      {/* Hero Section */}
      <section 
  className="relative bg-cover bg-center bg-no-repeat py-20"
  style={{
    backgroundImage: "url('/banner-mc1.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center"
       
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Premium Bags </h1>
            <p className="text-xl font-semibold mb-8">
              Discover our curated collection of high-quality bags, totes, backpacks, and accessories crafted for style
              and durability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/products">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Carousel */}
      <CategoryCarousel />

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Handpicked favorites that combine style, quality, and functionality
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg" asChild>
                <Link href="/products">
                  View All Products <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Latest Products */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest Arrivals</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Fresh additions to our collection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/products">
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Free Delivery</h3>
              <p className="text-muted-foreground text-sm">Free delivery on orders over KES 5,000 within Nairobi</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-muted-foreground text-sm">30-day return policy on all products</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground text-sm">Get help whenever you need it</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

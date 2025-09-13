"use client"

import { useQuery } from "convex/react"
import { api } from "../convex/_generated/api"
import { CategoryCarousel } from "@/components/storefront/category-carousel"
import { ProductCard } from "@/components/storefront/product-card"
import { StorefrontNavbar } from "@/components/storefront/navbar"
import { Button } from "@/components/ui/button"
import { ArrowRight, Truck, Shield, Headphones, Star, Users, Package } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/storefront/footer"
import { SkeletonProductCard } from "@/components/storefront/skeleton-products"

export default function HomePage() {
  const featuredProducts = useQuery(api.productCatalog.listFeatured)
  const allProducts = useQuery(api.productCatalog.listActive)

  console.log('products->',featuredProducts)

  return (
    <div className="min-h-screen">
      <StorefrontNavbar />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/banner-mc1.png')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="h-4 w-4" />
              <span>Premium Quality • Free Shipping</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Premium 
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Bags & More
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
              Discover our curated collection of high-quality bags, backpacks, and accessories. 
              Style meets functionality in every piece.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2 text-white">
                <Users className="h-5 w-5 text-purple-400" />
                <span className="text-sm">10,000+ Happy Customers</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Package className="h-5 w-5 text-purple-400" />
                <span className="text-sm">500+ Premium Products</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Star className="h-5 w-5 text-purple-400" />
                <span className="text-sm">4.9/5 Customer Rating</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                asChild
              >
                <Link href="/products">
                  Shop Collection <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/90 text-gray-900 border-white/50 hover:bg-white hover:text-gray-900 px-8 py-6 text-lg font-semibold backdrop-blur-sm transition-all duration-300"
                asChild
              >
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-24 h-24 bg-gradient-to-br from-purple-400/30 to-purple-600/30 rounded-full blur-2xl" />
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-3">
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Free Delivery</h3>
              <p className="text-sm text-gray-600">Orders over KES 15,000</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-3">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Quality Promise</h3>
              <p className="text-sm text-gray-600">30-day guarantee</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-3">
                <Headphones className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">24/7 Support</h3>
              <p className="text-sm text-gray-600">Always here to help</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-3">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Top Rated</h3>
              <p className="text-sm text-gray-600">4.9/5 stars</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Carousel */}
      <CategoryCarousel />

{/* Featured Products */}
<section className="py-20 bg-white">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
        <Star className="h-4 w-4" />
        Featured Collection
      </div>
      <h2 className="text-4xl font-bold mb-4 text-gray-900">Handpicked for You</h2>
      <p className="text-gray-600 max-w-2xl mx-auto text-lg">
        Our most popular items that combine style, quality, and functionality
      </p>
    </div>

    {/* Loading State */}
    {!featuredProducts && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(3)].map((_, i) => (
          <SkeletonProductCard key={i} />
        ))}
      </div>
    )}

    {/* Error State */}
    {featuredProducts === null && (
      <div className="text-center py-12 text-red-600 font-medium">
        Failed to load featured products. Please try again.
      </div>
    )}

    {/* Data Loaded */}
    {featuredProducts && featuredProducts.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {featuredProducts.slice(0, 8).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    ) : (
      featuredProducts !== null && (
        <div className="col-span-full text-center py-12 text-gray-500">
          No featured products available yet.
        </div>
      )
    )}

    <div className="text-center mt-12">
      <Button 
        variant="outline" 
        size="lg" 
        className="border-purple-200 text-purple-700 hover:bg-purple-50 px-8 py-6 text-lg"
        asChild
      >
        <Link href="/products">
          View All Products <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
    </div>
  </div>
</section>

{/* Latest Products */}
<section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
        <Package className="h-4 w-4" />
        New Arrivals
      </div>
      <h2 className="text-4xl font-bold mb-4 text-gray-900">Latest Additions</h2>
      <p className="text-gray-600 max-w-2xl mx-auto text-lg">Fresh styles just added to our collection</p>
    </div>

    {/* Loading State */}
    {!allProducts && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(3)].map((_, i) => (
          <SkeletonProductCard key={i} />
        ))}
      </div>
    )}

    {/* Error State */}
    {allProducts === null && (
      <div className="text-center py-12 text-red-600 font-medium">
        Failed to load new arrivals. Please try again.
      </div>
    )}

    {/* Data Loaded */}
    {allProducts && allProducts.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allProducts.slice(0, 8).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    ) : (
      allProducts !== null && (
        <div className="col-span-full text-center py-12 text-gray-500">
          No new products available yet.
        </div>
      )
    )}

    <div className="text-center mt-12">
      <Button 
        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
        asChild
      >
        <Link href="/products">
          Explore All Products <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
    </div>
  </div>
</section>
      <Footer />
    </div>
  )
}
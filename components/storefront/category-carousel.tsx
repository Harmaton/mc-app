
"use client"

import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Link from "next/link"

export function CategoryCarousel() {
  const categories = useQuery(api.categories.listActive) || []
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.max(1, categories.length - 2))
  }

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + Math.max(1, categories.length - 2)) % Math.max(1, categories.length - 2),
    )
  }

  if (categories.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Shop by Category
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Browse Our Collections</h2>
            <div className="text-gray-600">No categories available at the moment</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-300 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-200 rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Browse Collections
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover our carefully curated categories designed to help you find exactly what you&apos;re looking for
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Buttons */}
          {categories.length > 3 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/90 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/90 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
                onClick={nextSlide}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
            {categories.slice(currentIndex, currentIndex + 3).map((category) => (
              <Link key={category._id} href={`/categories/${category._id}`}>
                <Card className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 h-full bg-white border-0 shadow-lg overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img
                        src={category.imageUrl || "/banner-mc.png"}
                        alt={category.name}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      />
                      
                      {/* Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-xl mb-2 group-hover:text-purple-200 transition-colors">
                              {category.name}
                            </h3>
                            <p className="text-white/90 text-sm line-clamp-2 group-hover:text-white transition-colors">
                              {category.description}
                            </p>
                          </div>
                          
                          {/* Arrow Icon */}
                          <div className="ml-4 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                              <ArrowRight className="h-5 w-5 text-white" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Shop Now Button */}
                        <div className="mt-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-4 py-2 shadow-lg"
                          >
                            Shop Now
                          </Button>
                        </div>
                      </div>

                      {/* Corner Accent */}
                      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Dots Indicator */}
          {categories.length > 3 && (
            <div className="flex justify-center mt-12 space-x-3">
              {Array.from({ length: Math.max(1, categories.length - 2) }).map((_, index) => (
                <button
                  key={index}
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? "bg-gradient-to-r from-purple-600 to-purple-700 scale-125" 
                      : "bg-purple-200 hover:bg-purple-300"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-16">
          <Button 
            size="lg"
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50 px-8 py-4 text-lg font-semibold"
            asChild
          >
            <Link href="/categories">
              View All Categories <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
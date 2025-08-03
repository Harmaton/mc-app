"use client"

import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { StorefrontNavbar } from "@/components/storefront/navbar"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function CategoriesPage() {
  const categories = useQuery(api.categories.listActive) || []

  return (
    <div className="min-h-screen">
      <StorefrontNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Shop by Category</h1>
          <p className="text-muted-foreground">Browse our collection by bag type and style</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category._id} href={`/categories/${category._id}`}>
              <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                    <img
                      src={category.imageUrl || "/placeholder.svg?height=300&width=400&text=Category"}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-semibold text-xl mb-2">{category.name}</h3>
                      <p className="text-white/80 text-sm line-clamp-2">{category.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No categories available</h3>
            <p className="text-muted-foreground">Categories will appear here when they are created.</p>
          </div>
        )}
      </div>
    </div>
  )
}

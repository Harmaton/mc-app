"use client"

import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { ProductCard } from "@/components/storefront/product-card"
import { StorefrontNavbar } from "@/components/storefront/navbar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Id } from "../../../convex/_generated/dataModel"

interface CategoryPageProps {
  params: {
    id: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categories = useQuery(api.categories.list) || []
  const products =
    useQuery(api.productCatalog.listByCategory, {
      categoryId: params.id as Id<"categories">,
    }) || []

  const category = categories.find((c) => c._id === params.id)

  if (categories.length > 0 && !category) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <StorefrontNavbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/categories">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Link>
        </Button>

        {category && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
            <p className="text-muted-foreground">{category.description}</p>
          </div>
        )}

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No products in this category</h3>
            <p className="text-muted-foreground mb-4">
              Products will appear here when they are added to this category.
            </p>
            <Button asChild>
              <Link href="/products">Browse All Products</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Eye } from "lucide-react"
import Link from "next/link"
import { useCart } from "./cart-provider"
import { toast } from "sonner"
import type { Id } from "../../convex/_generated/dataModel"

interface Product {
  _id: Id<"productCatalog">
  name: string
  description: string
  slug: string
  basePrice: number
  stockQuantity: number
  imageUrls: string[]
  colors: string[]
  sizes: string[]
  isFeatured: boolean
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (product.stockQuantity <= 0) {
      toast.error("Product is out of stock")
      return
    }

    addItem({
      productId: product._id,
      name: product.name,
      price: product.basePrice,
      imageUrl: product.imageUrls[0] || "/placeholder.svg",
      slug: product.slug,
    })

    toast.success(`${product.name} added to cart!`)
  }

  const getStockStatus = () => {
    if (product.stockQuantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    } else if (product.stockQuantity <= 5) {
      return <Badge variant="secondary">Low Stock</Badge>
    } else {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          In Stock
        </Badge>
      )
    }
  }

  return (
    <Link href={`/item/${product.slug}`}>
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full">
        <CardContent className="p-0">
          <div className="aspect-square relative overflow-hidden rounded-t-lg">
            <img
              src={product.imageUrls[0] || "/placeholder.svg?height=300&width=300&text=Product"}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
              <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="secondary" className="h-8 w-8">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              {product.isFeatured && <Badge className="bg-primary text-primary-foreground">Featured</Badge>}
              {getStockStatus()}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 flex flex-col items-start space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1 w-full">{product.name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 w-full">{product.description}</p>

          {/* Colors & Sizes */}
          <div className="flex flex-wrap gap-1 w-full">
            {product.colors.slice(0, 3).map((color) => (
              <Badge key={color} variant="outline" className="text-xs">
                {color}
              </Badge>
            ))}
            {product.colors.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{product.colors.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between w-full mt-2">
            <div className="flex flex-col">
              <span className="font-bold text-lg">KES {product.basePrice.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">{product.stockQuantity} in stock</span>
            </div>

            <Button size="sm" onClick={handleAddToCart} disabled={product.stockQuantity <= 0} className="shrink-0">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

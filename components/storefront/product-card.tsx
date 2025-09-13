"use client"

import type React from "react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Eye, Star } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import type { Id } from "../../convex/_generated/dataModel"
import Image from 'next/image'
import { useCart } from "@/providers/cart-provider"

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
      return <Badge variant="destructive" className="text-xs font-medium">Out of Stock</Badge>
    } else if (product.stockQuantity <= 5) {
      return <Badge className="bg-orange-100 text-orange-800 text-xs font-medium">Low Stock</Badge>
    } else {
      return (
        <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-medium">
          In Stock
        </Badge>
      )
    }
  }

  return (
    <Link href={`/item/${product.slug}`}>
      <Card className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full bg-white border-0 shadow-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="aspect-square relative overflow-hidden">
            <Image
              width={400}
              height={400}
              src={product.imageUrls[0] || "/banner-mc.png"}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Overlay Actions */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="flex gap-3">
                <Button 
                  size="icon" 
                  className="h-12 w-12 rounded-full bg-white/90 text-gray-800 hover:bg-white hover:scale-110 transition-all duration-300 backdrop-blur-sm shadow-lg"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toast.info("Added to wishlist!")
                  }}
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button 
                  size="icon" 
                  className="h-12 w-12 rounded-full bg-white/90 text-gray-800 hover:bg-white hover:scale-110 transition-all duration-300 backdrop-blur-sm shadow-lg"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toast.info("Quick view opened!")
                  }}
                >
                  <Eye className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isFeatured && (
                <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold px-3 py-1 shadow-lg">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              {getStockStatus()}
            </div>

            {/* Discount Badge (if needed) */}
            <div className="absolute top-3 right-3">
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold px-2 py-1 text-xs">
                NEW
              </Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 flex flex-col items-start space-y-4">
          {/* Product Title */}
          <div className="w-full">
            <h3 className="font-bold text-lg line-clamp-1 text-gray-900 group-hover:text-purple-700 transition-colors">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2 mt-1 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Colors Display */}
          {product.colors.length > 0 && (
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs font-medium text-gray-500">Colors:</span>
              <div className="flex gap-1">
                {product.colors.slice(0, 4).map((color, index) => (
                  <div
                    key={color}
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{
                      backgroundColor: color.toLowerCase().includes('black') ? '#000' :
                                     color.toLowerCase().includes('white') ? '#fff' :
                                     color.toLowerCase().includes('red') ? '#ef4444' :
                                     color.toLowerCase().includes('blue') ? '#3b82f6' :
                                     color.toLowerCase().includes('green') ? '#10b981' :
                                     color.toLowerCase().includes('purple') ? '#8b5cf6' :
                                     color.toLowerCase().includes('pink') ? '#ec4899' :
                                     color.toLowerCase().includes('brown') ? '#a3765b' :
                                     `hsl(${index * 60}, 70%, 50%)`
                    }}
                    title={color}
                  />
                ))}
                {product.colors.length > 4 && (
                  <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-gray-600">+{product.colors.length - 4}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sizes Display */}
          {product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 w-full">
              {product.sizes.slice(0, 3).map((size) => (
                <Badge key={size} variant="outline" className="text-xs border-purple-200 text-purple-700">
                  {size}
                </Badge>
              ))}
              {product.sizes.length > 3 && (
                <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
                  +{product.sizes.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Rating Stars */}
          <div className="flex items-center gap-2 w-full">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-600">(4.2)</span>
            <span className="text-xs text-gray-500">• 127 reviews</span>
          </div>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between w-full pt-2 border-t border-gray-100">
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-900">KES {product.basePrice.toLocaleString()}</span>
              <span className="text-xs text-gray-500">{product.stockQuantity} available</span>
            </div>

            <Button 
              size="sm" 
              onClick={handleAddToCart} 
              disabled={product.stockQuantity <= 0}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
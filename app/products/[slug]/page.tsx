"use client"

import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { StorefrontNavbar } from "@/components/storefront/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Heart, Share2, Truck, Shield, ArrowLeft } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { useCart } from "@/providers/cart-provider"

export default function ProductPage() {
  const { slug } = useParams()

  const id = slug

  if (!id) {
    notFound()
  }

  const productId = typeof id === "string" ? id : ""

  const product = useQuery(api.productCatalog.getBySlug, { slug: productId })
  const categories = useQuery(api.categories.list) || []
  const { addItem } = useCart()

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState(1)

  // Handle loading state
  if (product === undefined) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StorefrontNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Handle product not found
  if (product === null) {
    notFound()
  }

  const category = categories.find((c) => c._id === product.categoryId)

  const handleAddToCart = () => {
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
      selectedColor,
      selectedSize,
    })

    toast.success(`${product.name} added to cart!`, {
      description: `Quantity: ${quantity}${selectedColor ? ` • Color: ${selectedColor}` : ""}${selectedSize ? ` • Size: ${selectedSize}` : ""}`,
    })
  }

  const getStockStatus = () => {
    if (product.stockQuantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    } else if (product.stockQuantity <= 5) {
      return <Badge variant="secondary">Only {product.stockQuantity} left</Badge>
    } else {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          In Stock
        </Badge>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StorefrontNavbar />

      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="text-gray-500 hover:text-lavender-600 transition-colors">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/products" className="text-gray-500 hover:text-lavender-600 transition-colors">
            Products
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-10 text-gray-700 hover:text-lavender-600 hover:bg-lavender-50 transition-all duration-300"
          asChild
        >
          <Link href="/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-500">
              <img
                src={product.imageUrls[selectedImageIndex] || "/placeholder.svg?height=800&width=800&text=Product"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              {product.isFeatured && (
                <Badge
                  className="absolute top-4 left-4 bg-gradient-to-r from-lavender-600 to-purple-600 text-white px-3 py-1 text-xs font-medium shadow-lg"
                  variant="default"
                >
                  Featured
                </Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.imageUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImageIndex === index
                        ? "border-lavender-500 shadow-md scale-105"
                        : "border-gray-100 hover:border-lavender-200 hover:scale-102"
                    }`}
                  >
                    <img
                      src={url || "/placeholder.svg?height=150&width=150&text=Thumb"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {selectedImageIndex === index && (
                      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {getStockStatus()}
                {category && (
                  <Badge
                    variant="outline"
                    className="border-lavender-200 text-lavender-700 bg-lavender-50 font-medium"
                  >
                    {category.name}
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                {product.name}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-4xl font-bold text-gray-900">
                KES {product.basePrice.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                SKU: {product.sku}
              </span>
            </div>

            {/* Colors */}
            {product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      size="lg"
                      onClick={() => setSelectedColor(color)}
                      className={`px-5 py-3 rounded-full text-base transition-all duration-300 border-2 ${
                        selectedColor === color
                          ? "bg-lavender-600 text-white border-lavender-600 shadow-lg"
                          : "border-gray-200 text-gray-700 hover:border-lavender-300 hover:bg-lavender-50"
                      }`}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">Size</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="lg"
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-full text-base transition-all duration-300 border-2 ${
                        selectedSize === size
                          ? "bg-lavender-600 text-white border-lavender-600 shadow-lg"
                          : "border-gray-200 text-gray-700 hover:border-lavender-300 hover:bg-lavender-50"
                      }`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">Quantity</h3>
              <div className="flex items-center gap-4 w-fit">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="h-12 w-12 rounded-full border-gray-200 hover:bg-lavender-50"
                >
                  -
                </Button>
                <span className="w-16 text-center text-lg font-medium text-gray-900">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  disabled={quantity >= product.stockQuantity}
                  className="h-12 w-12 rounded-full border-gray-200 hover:bg-lavender-50"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-lavender-600 to-purple-600 hover:from-lavender-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                onClick={handleAddToCart}
                disabled={product.stockQuantity <= 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 w-12 rounded-full border-gray-200 text-gray-700 hover:bg-lavender-50 hover:text-lavender-600 transition-all duration-300"
                onClick={() => toast.info("Added to wishlist!")}
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 w-12 rounded-full border-gray-200 text-gray-700 hover:bg-lavender-50 hover:text-lavender-600 transition-all duration-300"
                onClick={() => toast.info("Share link copied!")}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <Separator className="my-8 border-gray-100" />

            {/* Trust Badges */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Truck className="h-5 w-5 text-lavender-600" />
                <span className="text-base">Free delivery on orders over KES 5,000</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Shield className="h-5 w-5 text-lavender-600" />
                <span className="text-base">30-day hassle-free returns</span>
              </div>
            </div>

            {/* Product Details Card */}
            {(product.materials.length > 0 || product.dimensions || product.weight > 0) && (
              <Card className="border-gray-100 shadow-none hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-4">Craftsmanship Details</h3>
                  <div className="space-y-3 text-gray-600">
                    {product.materials.length > 0 && (
                      <div className="flex justify-between">
                        <span className="font-medium">Materials:</span>
                        <span>{product.materials.join(", ")}</span>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="flex justify-between">
                        <span className="font-medium">Dimensions:</span>
                        <span>
                          {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                        </span>
                      </div>
                    )}
                    {product.weight > 0 && (
                      <div className="flex justify-between">
                        <span className="font-medium">Weight:</span>
                        <span>{product.weight}g</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
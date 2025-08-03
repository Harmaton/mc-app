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
import { useCart } from "@/components/storefront/cart-provider"
import { toast } from "sonner"
import Link from "next/link"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = useQuery(api.productCatalog.getBySlug, { slug: params.slug })
  const categories = useQuery(api.categories.list) || []
  const { addItem } = useCart()

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState(1)

  // Handle loading state
  if (product === undefined) {
    return (
      <div className="min-h-screen">
        <StorefrontNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
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
    <div className="min-h-screen">
      <StorefrontNavbar />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">
            Products
          </Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg border">
              <img
                src={product.imageUrls[selectedImageIndex] || "/placeholder.svg?height=600&width=600&text=Product"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isFeatured && (
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">Featured</Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.imageUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg border-2 overflow-hidden ${
                      selectedImageIndex === index ? "border-primary" : "border-muted"
                    }`}
                  >
                    <img
                      src={url || "/placeholder.svg?height=150&width=150&text=Thumb"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {getStockStatus()}
                {category && <Badge variant="outline">{category.name}</Badge>}
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold">KES {product.basePrice.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
            </div>

            {/* Colors */}
            {product.colors.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedColor(color)}
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
                <h3 className="font-medium mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-medium mb-3">Quantity</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  disabled={quantity >= product.stockQuantity}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={product.stockQuantity <= 0}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Product Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Free delivery on orders over KES 5,000</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">30-day return policy</span>
              </div>
            </div>

            {/* Materials & Dimensions */}
            {(product.materials.length > 0 || product.dimensions) && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3">Product Details</h3>
                  <div className="space-y-2 text-sm">
                    {product.materials.length > 0 && (
                      <div>
                        <span className="font-medium">Materials: </span>
                        <span>{product.materials.join(", ")}</span>
                      </div>
                    )}
                    {product.dimensions && (
                      <div>
                        <span className="font-medium">Dimensions: </span>
                        <span>
                          {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                        </span>
                      </div>
                    )}
                    {product.weight > 0 && (
                      <div>
                        <span className="font-medium">Weight: </span>
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

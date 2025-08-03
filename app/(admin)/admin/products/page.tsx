"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Package, ImageIcon, Star } from "lucide-react"
import { toast } from "sonner"

import { useQuery, useMutation } from "convex/react"
import { Id } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"


interface Product {
  _id: Id<"productCatalog">
  name: string
  description: string
  categoryId: Id<"categories">
  basePrice: number
  costPrice: number
  sku: string
  colors: string[]
  sizes: string[]
  materials: string[]
  dimensions: {
    length: number
    width: number
    height: number
  }
  weight: number
  stockQuantity: number
  minStockLevel: number
  imageUrls: string[]
  tags: string[]
  isActive: boolean
  isFeatured: boolean
  createdAt: number
}

export default function ProductsPage() {
  const products = useQuery(api.productCatalog.list) || []
  const categories = useQuery(api.categories.listActive) || []
  const productStats = useQuery(api.productCatalog.getStats)
  const createProduct = useMutation(api.productCatalog.create)
  const deleteProduct = useMutation(api.productCatalog.remove)
  const updateProduct = useMutation(api.productCatalog.update)

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    categoryId: "",
    basePrice: "",
    costPrice: "",
    sku: "",
    colors: "",
    sizes: "",
    materials: "",
    length: "",
    width: "",
    height: "",
    weight: "",
    stockQuantity: "",
    minStockLevel: "",
    imageUrls: "",
    tags: "",
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddProduct = async () => {
    // Validation
    if (!newProduct.name.trim()) {
      toast.error("Product name is required")
      return
    }
    if (!newProduct.categoryId) {
      toast.error("Category is required")
      return
    }
    if (!newProduct.basePrice || Number.parseFloat(newProduct.basePrice) <= 0) {
      toast.error("Valid base price is required")
      return
    }
    if (!newProduct.costPrice || Number.parseFloat(newProduct.costPrice) <= 0) {
      toast.error("Valid cost price is required")
      return
    }
    if (!newProduct.sku.trim()) {
      toast.error("SKU is required")
      return
    }

    setIsLoading(true)
    try {
            await createProduct({
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        categoryId: newProduct.categoryId as Id<"categories">,
        basePrice: Number.parseFloat(newProduct.basePrice),
        costPrice: Number.parseFloat(newProduct.costPrice),
        sku: newProduct.sku.trim(),
        colors: newProduct.colors ? newProduct.colors.split(",").map((c) => c.trim()) : [],
        sizes: newProduct.sizes ? newProduct.sizes.split(",").map((s) => s.trim()) : [],
        materials: newProduct.materials ? newProduct.materials.split(",").map((m) => m.trim()) : [],
        dimensions: {
          length: Number.parseFloat(newProduct.length) || 0,
          width: Number.parseFloat(newProduct.width) || 0,
          height: Number.parseFloat(newProduct.height) || 0,
        },
        weight: Number.parseFloat(newProduct.weight) || 0,
        stockQuantity: Number.parseInt(newProduct.stockQuantity) || 0,
        minStockLevel: Number.parseInt(newProduct.minStockLevel) || 0,
        imageUrls: newProduct.imageUrls ? newProduct.imageUrls.split(",").map((url) => url.trim()) : [],
        tags: newProduct.tags ? newProduct.tags.split(",").map((t) => t.trim()) : [],
      })

      toast.success("Product created successfully!")
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to create product:", error)
      toast.error("Failed to create product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProduct = async (id: Id<"productCatalog">, name: string) => {
    try {
      await deleteProduct({ id })
      toast.success(`Product "${name}" deleted successfully!`)
    } catch (error) {
      console.error("Failed to delete product:", error)
      toast.error("Failed to delete product. Please try again.")
    }
  }

  const handleToggleFeatured = async (id: Id<"productCatalog">, isFeatured: boolean, name: string) => {
    try {
      await updateProduct({ id, isFeatured: !isFeatured })
      toast.success(`Product "${name}" ${!isFeatured ? "featured" : "unfeatured"} successfully!`)
    } catch (error) {
      console.error("Failed to update product:", error)
      toast.error("Failed to update product. Please try again.")
    }
  }

  const getStockStatus = (stockQuantity: number, minStockLevel: number) => {
    if (stockQuantity === 0) {
      return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
    } else if (stockQuantity <= minStockLevel) {
      return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
    } else {
      return <Badge className="bg-green-100 text-green-800">In Stock</Badge>
    }
  }

  const resetForm = () => {
    setNewProduct({
      name: "",
      description: "",
      categoryId: "",
      basePrice: "",
      costPrice: "",
      sku: "",
      colors: "",
      sizes: "",
      materials: "",
      length: "",
      width: "",
      height: "",
      weight: "",
      stockQuantity: "",
      minStockLevel: "",
      imageUrls: "",
      tags: "",
    })
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Create a new product in your catalog with detailed specifications.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-medium">Basic Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="e.g., Premium Leather Tote"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                      placeholder="e.g., PLT-001"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Detailed product description..."
                    rows={3}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    onValueChange={(value) => setNewProduct({ ...newProduct, categoryId: value })}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h4 className="font-medium">Pricing (KES)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="basePrice">Base Price *</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      value={newProduct.basePrice}
                      onChange={(e) => setNewProduct({ ...newProduct, basePrice: e.target.value })}
                      placeholder="0"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="costPrice">Cost Price *</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      value={newProduct.costPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, costPrice: e.target.value })}
                      placeholder="0"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Product Variants */}
              <div className="space-y-4">
                <h4 className="font-medium">Product Variants</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="colors">Colors (comma-separated)</Label>
                    <Input
                      id="colors"
                      value={newProduct.colors}
                      onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })}
                      placeholder="Black, Brown, Red"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sizes">Sizes (comma-separated)</Label>
                    <Input
                      id="sizes"
                      value={newProduct.sizes}
                      onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                      placeholder="Small, Medium, Large"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="materials">Materials (comma-separated)</Label>
                    <Input
                      id="materials"
                      value={newProduct.materials}
                      onChange={(e) => setNewProduct({ ...newProduct, materials: e.target.value })}
                      placeholder="Leather, Canvas, Cotton"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Dimensions & Weight */}
              <div className="space-y-4">
                <h4 className="font-medium">Dimensions & Weight</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="length">Length (cm)</Label>
                    <Input
                      id="length"
                      type="number"
                      value={newProduct.length}
                      onChange={(e) => setNewProduct({ ...newProduct, length: e.target.value })}
                      placeholder="0"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="width">Width (cm)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={newProduct.width}
                      onChange={(e) => setNewProduct({ ...newProduct, width: e.target.value })}
                      placeholder="0"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={newProduct.height}
                      onChange={(e) => setNewProduct({ ...newProduct, height: e.target.value })}
                      placeholder="0"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="weight">Weight (g)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={newProduct.weight}
                      onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
                      placeholder="0"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="space-y-4">
                <h4 className="font-medium">Inventory</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="stockQuantity">Stock Quantity</Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      value={newProduct.stockQuantity}
                      onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
                      placeholder="0"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="minStockLevel">Min Stock Level</Label>
                    <Input
                      id="minStockLevel"
                      type="number"
                      value={newProduct.minStockLevel}
                      onChange={(e) => setNewProduct({ ...newProduct, minStockLevel: e.target.value })}
                      placeholder="0"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Media & Tags */}
              <div className="space-y-4">
                <h4 className="font-medium">Media & Tags</h4>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="imageUrls">Image URLs (comma-separated)</Label>
                    <Input
                      id="imageUrls"
                      value={newProduct.imageUrls}
                      onChange={(e) => setNewProduct({ ...newProduct, imageUrls: e.target.value })}
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={newProduct.tags}
                      onChange={(e) => setNewProduct({ ...newProduct, tags: e.target.value })}
                      placeholder="premium, leather, handmade"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct} disabled={isLoading}>
                {isLoading ? "Creating..." : "Add Product"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Product Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productStats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">{productStats?.activeProducts || 0} active products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <Package className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productStats?.lowStockProducts || 0}</div>
            <p className="text-xs text-muted-foreground">Need restocking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productStats?.outOfStockProducts || 0}</div>
            <p className="text-xs text-muted-foreground">Unavailable items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Products</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productStats?.featuredProducts || 0}</div>
            <p className="text-xs text-muted-foreground">Highlighted items</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Catalog
          </CardTitle>
          <CardDescription>Manage your product inventory and specifications.</CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No products yet</h3>
              <p className="text-muted-foreground mb-4">Create your first product to start building your catalog.</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price (KES)</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="hidden md:table-cell">SKU</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const category = categories.find((c) => c._id === product.categoryId)
                  const profit = product.basePrice - product.costPrice
                  const profitMargin = product.basePrice > 0 ? ((profit / product.basePrice) * 100).toFixed(1) : "0"

                  return (
                    <TableRow key={product._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.imageUrls.length > 0 ? (
                            <img
                              src={product.imageUrls[0] || "/placeholder.svg"}
                              alt={product.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {product.name}
                              {product.isFeatured && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                            </div>
                            <div className="text-sm text-muted-foreground">Margin: {profitMargin}%</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{category?.name || "Unknown"}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.basePrice.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">
                            Cost: {product.costPrice.toLocaleString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.stockQuantity}</div>
                          {getStockStatus(product.stockQuantity, product.minStockLevel)}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <code className="text-sm bg-muted px-1 py-0.5 rounded">{product.sku}</code>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={product.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleFeatured(product._id, product.isFeatured, product.name)}
                            title={product.isFeatured ? "Remove from Featured" : "Add to Featured"}
                          >
                            <Star className={`h-4 w-4 ${product.isFeatured ? "text-yellow-500 fill-current" : ""}`} />
                          </Button>
                          <Button variant="outline" size="sm" title="Edit Product">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product._id, product.name)}
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

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
import { Plus, Edit, Trash2, CheckCircle, User, AlertCircle } from "lucide-react"
import { toast } from "sonner"

import { useQuery, useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import type { Id } from "../../../convex/_generated/dataModel"

export default function OrdersPage() {
  const orders = useQuery(api.products.listWithProducts) || []
  const categories = useQuery(api.categories.listActive) || []
  const customers = useQuery(api.customers.list) || []
  const products = useQuery(api.productCatalog.listActive) || []
  const createOrder = useMutation(api.products.create)
  const deleteOrder = useMutation(api.products.remove)
  const markAsSold = useMutation(api.products.markAsSold)

  const [newOrder, setNewOrder] = useState({
    customerId: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    productCatalogId: "",
    deliveryFee: "",
    deliveryDestination: "",
    notes: "",
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [useExistingCustomer, setUseExistingCustomer] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const handleCustomerSelect = (customerId: string) => {
    const customer = customers.find((c) => c._id === customerId)
    if (customer) {
      setNewOrder({
        ...newOrder,
        customerId,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        customerAddress: customer.address,
      })
    }
  }

  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p._id === productId)
    if (product) {
      setSelectedProduct(product)
      setNewOrder({
        ...newOrder,
        productCatalogId: productId,
      })
    }
  }

  const handleAddOrder = async () => {
    // Validation
    if (!newOrder.customerName.trim()) {
      toast.error("Customer name is required")
      return
    }
    if (!newOrder.customerPhone.trim()) {
      toast.error("Customer phone is required")
      return
    }
    if (!newOrder.productCatalogId) {
      toast.error("Product selection is required")
      return
    }

    setIsLoading(true)
    try {
      await createOrder({
        productCatalogId: newOrder.productCatalogId as Id<"productCatalog">,
        customerId: newOrder.customerId ? (newOrder.customerId as Id<"customers">) : undefined,
        customerName: newOrder.customerName.trim(),
        customerPhone: newOrder.customerPhone.trim(),
        customerEmail: newOrder.customerEmail.trim(),
        customerAddress: newOrder.customerAddress.trim(),
        deliveryFee: Number.parseFloat(newOrder.deliveryFee || "0"),
        deliveryDestination: newOrder.deliveryDestination.trim(),
        notes: newOrder.notes.trim() || undefined,
      })

      toast.success(`Order created successfully for ${newOrder.customerName}!`, {
        description: `Product: ${selectedProduct?.name} • Total: KES ${((selectedProduct?.basePrice || 0) + Number.parseFloat(newOrder.deliveryFee || "0")).toLocaleString()}`,
      })
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to create order:", error)
      if (error instanceof Error) {
        toast.error("Failed to create order", {
          description: error.message,
          icon: <AlertCircle className="h-4 w-4" />,
        })
      } else {
        toast.error("Failed to create order", {
          description: "An unexpected error occurred. Please try again.",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteOrder = async (id: Id<"products">, customerName: string, productName: string) => {
    try {
      await deleteOrder({ id })
      toast.success("Order deleted successfully", {
        description: `Removed ${productName} order for ${customerName}`,
      })
    } catch (error) {
      console.error("Failed to delete order:", error)
      toast.error("Failed to delete order", {
        description: "Please try again or contact support if the issue persists.",
      })
    }
  }

  const handleMarkAsSold = async (id: Id<"products">, customerName: string, productName: string) => {
    try {
      await markAsSold({
        id,
        dateStockSold: new Date().toISOString().split("T")[0],
      })
      toast.success("Order marked as sold! 🎉", {
        description: `${productName} sold to ${customerName} • Stock updated`,
      })
    } catch (error) {
      console.error("Failed to mark as sold:", error)
      if (error instanceof Error) {
        toast.error("Cannot complete sale", {
          description: error.message,
          icon: <AlertCircle className="h-4 w-4" />,
        })
      } else {
        toast.error("Failed to mark order as sold", {
          description: "Please try again or check product availability.",
        })
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_stock":
        return <Badge className="bg-blue-100 text-blue-800">In Stock</Badge>
      case "sold":
        return <Badge className="bg-green-100 text-green-800">Sold</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const resetForm = () => {
    setNewOrder({
      customerId: "",
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      customerAddress: "",
      productCatalogId: "",
      deliveryFee: "",
      deliveryDestination: "",
      notes: "",
    })
    setSelectedProduct(null)
    setUseExistingCustomer(true)
  }

  // Group products by category for better display
  const productsByCategory = products.reduce(
    (acc, product) => {
      const category = categories.find((c) => c._id === product.categoryId)
      const categoryName = category?.name || "Unknown Category"
      if (!acc[categoryName]) {
        acc[categoryName] = []
      }
      acc[categoryName].push(product)
      return acc
    },
    {} as Record<string, any[]>,
  )

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
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
              Add New Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Order</DialogTitle>
              <DialogDescription>Create a new order by selecting a product from your catalog.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Product Selection */}
              <div className="space-y-4">
                <h4 className="font-medium">Product Selection</h4>
                <div className="grid gap-2">
                  <Label htmlFor="product">Select Product *</Label>
                  <Select onValueChange={handleProductSelect} disabled={isLoading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a product from catalog" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(productsByCategory).map(([categoryName, categoryProducts]) => (
                        <div key={categoryName}>
                          <div className="px-2 py-1 text-sm font-medium text-muted-foreground">{categoryName}</div>
                          {categoryProducts.map((product) => (
                            <SelectItem key={product._id} value={product._id} disabled={product.stockQuantity <= 0}>
                              <div className="flex items-center justify-between w-full">
                                <span className={product.stockQuantity <= 0 ? "text-muted-foreground" : ""}>
                                  {product.name}
                                  {product.stockQuantity <= 0 && " (Out of Stock)"}
                                </span>
                                <span className="text-sm text-muted-foreground ml-2">
                                  KES {product.basePrice.toLocaleString()} • Stock: {product.stockQuantity}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Details Preview */}
                {selectedProduct && (
                  <div
                    className={`p-4 rounded-lg ${selectedProduct.stockQuantity <= 0 ? "bg-red-50 border border-red-200" : "bg-muted"}`}
                  >
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      Selected Product Details
                      {selectedProduct.stockQuantity <= 0 && (
                        <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
                      )}
                    </h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Name:</span> {selectedProduct.name}
                      </div>
                      <div>
                        <span className="text-muted-foreground">SKU:</span> {selectedProduct.sku}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Price:</span> KES{" "}
                        {selectedProduct.basePrice.toLocaleString()}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cost:</span> KES{" "}
                        {selectedProduct.costPrice.toLocaleString()}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Stock:</span>
                        <span className={selectedProduct.stockQuantity <= 0 ? "text-red-600 font-medium" : ""}>
                          {" "}
                          {selectedProduct.stockQuantity} units
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Profit:</span> KES{" "}
                        {(selectedProduct.basePrice - selectedProduct.costPrice).toLocaleString()}
                      </div>
                    </div>
                    {selectedProduct.stockQuantity <= 0 && (
                      <div className="mt-2 p-2 bg-red-100 rounded text-sm text-red-800">
                        <AlertCircle className="h-4 w-4 inline mr-1" />
                        This product is out of stock and cannot be ordered.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Customer Selection Toggle */}
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant={useExistingCustomer ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseExistingCustomer(true)}
                  disabled={isLoading}
                >
                  <User className="mr-2 h-4 w-4" />
                  Existing Customer
                </Button>
                <Button
                  type="button"
                  variant={!useExistingCustomer ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setUseExistingCustomer(false)
                    setNewOrder({
                      ...newOrder,
                      customerId: "",
                      customerName: "",
                      customerPhone: "",
                      customerEmail: "",
                      customerAddress: "",
                    })
                  }}
                  disabled={isLoading}
                >
                  New Customer
                </Button>
              </div>

              {/* Customer Details */}
              <div className="space-y-4">
                <h4 className="font-medium">Customer Details</h4>

                {useExistingCustomer ? (
                  <div className="grid gap-2">
                    <Label htmlFor="existingCustomer">Select Customer *</Label>
                    <Select onValueChange={handleCustomerSelect} disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an existing customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer._id} value={customer._id}>
                            {customer.name} - {customer.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="customerName">Customer Name *</Label>
                      <Input
                        id="customerName"
                        value={newOrder.customerName}
                        onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                        placeholder="Enter customer name"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="customerPhone">Customer Phone *</Label>
                      <Input
                        id="customerPhone"
                        value={newOrder.customerPhone}
                        onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                        placeholder="Enter phone number"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

                {/* Show customer details if selected */}
                {newOrder.customerName && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="customerEmail">Customer Email</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={newOrder.customerEmail}
                        onChange={(e) => setNewOrder({ ...newOrder, customerEmail: e.target.value })}
                        placeholder="Enter email address"
                        disabled={isLoading || useExistingCustomer}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="customerAddress">Customer Address</Label>
                      <Input
                        id="customerAddress"
                        value={newOrder.customerAddress}
                        onChange={(e) => setNewOrder({ ...newOrder, customerAddress: e.target.value })}
                        placeholder="Enter customer address"
                        disabled={isLoading || useExistingCustomer}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Details */}
              <div className="space-y-4">
                <h4 className="font-medium">Delivery Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="deliveryDestination">Delivery Destination</Label>
                    <Input
                      id="deliveryDestination"
                      value={newOrder.deliveryDestination}
                      onChange={(e) => setNewOrder({ ...newOrder, deliveryDestination: e.target.value })}
                      placeholder="Enter delivery destination"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="deliveryFee">Delivery Fee (KES)</Label>
                    <Input
                      id="deliveryFee"
                      type="number"
                      value={newOrder.deliveryFee}
                      onChange={(e) => setNewOrder({ ...newOrder, deliveryFee: e.target.value })}
                      placeholder="0"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={3}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                onClick={handleAddOrder}
                disabled={isLoading || (selectedProduct && selectedProduct.stockQuantity <= 0)}
              >
                {isLoading ? "Creating..." : "Add Order"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>Manage orders linked to your product catalog.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Price (KES)</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead className="hidden md:table-cell">Order Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const category = categories.find((c) => c._id === order.product?.categoryId)
                const totalPrice = (order.product?.basePrice || 0) + order.deliveryFee
                return (
                  <TableRow key={order._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.product?.name || "Unknown Product"}</div>
                        <div className="text-sm text-muted-foreground">
                          <Badge variant="outline" className="mr-1">
                            {category?.name || "Unknown"}
                          </Badge>
                          SKU: {order.product?.sku}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{totalPrice.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          Product: {order.product?.basePrice?.toLocaleString() || 0} + Delivery:{" "}
                          {order.deliveryFee.toLocaleString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{order.deliveryDestination || "Not specified"}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {order.status === "in_stock" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleMarkAsSold(order._id, order.customerName, order.product?.name || "Product")
                            }
                            title="Mark as Sold"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm" title="Edit Order">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDeleteOrder(order._id, order.customerName, order.product?.name || "Product")
                          }
                          title="Delete Order"
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
        </CardContent>
      </Card>
    </div>
  )
}

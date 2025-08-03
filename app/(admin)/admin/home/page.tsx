"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCart, TrendingUp, Truck, PieChart, Receipt } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from "recharts"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"


export default function HomePage() {
  const stats = useQuery(api.products.getStats)
  const customerStats = useQuery(api.customers.getStats)
  const recentOrders = useQuery(api.products.listWithProducts)
  const recentSales = useQuery(api.products.getSalesWithProducts)
  const categories = useQuery(api.categories.list) || []

  // Prepare chart data for categories (orders vs sales)
  const categoryChartData = categories.map((category) => ({
    category: category.name,
    orders: stats?.categoryOrderStats?.[category.name] || 0,
    sales: stats?.categorySalesStats?.[category.name] || 0,
  }))

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase()
    if (name.includes("tote")) return ShoppingCart
    if (name.includes("medium")) return Package
    if (name.includes("small")) return PieChart
    if (name.includes("backpack")) return Truck
    return Package
  }

  const getCategoryColor = (categoryName: string) => {
    const name = categoryName.toLowerCase()
    if (name.includes("tote")) return "text-blue-600"
    if (name.includes("medium")) return "text-green-600"
    if (name.includes("small")) return "text-purple-600"
    if (name.includes("backpack")) return "text-orange-600"
    return "text-gray-600"
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {/* Main Stats - Orders vs Sales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.sold || 0} sold, {stats?.inStock || 0} in stock, {stats?.pending || 0} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSales || 0}</div>
            <p className="text-xs text-muted-foreground">Paid orders only</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {stats?.totalRevenue?.toLocaleString() || "0"}</div>
            <p className="text-xs text-muted-foreground">Profit: KES {stats?.profit?.toLocaleString() || "0"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Sale Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {stats?.avgSaleValue?.toFixed(0) || "0"}</div>
            <p className="text-xs text-muted-foreground">Avg order: KES {stats?.avgOrderValue?.toFixed(0) || "0"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Chart and Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>Orders vs Sales by category</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryChartData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="#3b82f6" name="Total Orders" />
                    <Bar dataKey="sales" fill="#10b981" name="Sales (Paid)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <Package className="h-12 w-12 mx-auto mb-4" />
                  <p>No categories found</p>
                  <p className="text-sm">Create categories to see performance data</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Category Stats</CardTitle>
            <CardDescription>Orders vs Sales breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryChartData.length > 0 ? (
              <div className="space-y-4">
                {categoryChartData.map((item) => {
                  const IconComponent = getCategoryIcon(item.category)
                  const colorClass = getCategoryColor(item.category)
                  const conversionRate = item.orders > 0 ? ((item.sales / item.orders) * 100).toFixed(1) : "0"
                  return (
                    <div key={item.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`h-4 w-4 ${colorClass}`} />
                        <span className="text-sm font-medium">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{item.orders} orders</div>
                        <div className="text-xs text-muted-foreground">
                          {item.sales} sales ({conversionRate}%)
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No categories available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Sales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders with their current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders?.slice(0, 5).map((order) => {
                const category = categories.find((c) => c._id === order.product?.categoryId)
                const totalPrice = (order.product?.basePrice || 0) + order.deliveryFee
                return (
                  <div key={order._id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.product?.name || "Unknown Product"} • {category?.name || "Unknown Category"} •{" "}
                        {order.deliveryDestination || "No destination"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">KES {totalPrice.toLocaleString()}</p>
                      <p
                        className={`text-xs ${
                          order.status === "sold"
                            ? "text-green-600"
                            : order.status === "pending"
                              ? "text-yellow-600"
                              : "text-blue-600"
                        }`}
                      >
                        {order.status.replace("_", " ").toUpperCase()}
                      </p>
                    </div>
                  </div>
                )
              })}
              {(!recentOrders || recentOrders.length === 0) && (
                <div className="text-center py-8">
                  <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No orders yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Business Summary</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Orders</span>
                <span className="font-medium">{stats?.totalOrders || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Conversion Rate</span>
                <span className="font-medium">
                  {stats?.totalOrders ? ((stats.totalSales / stats.totalOrders) * 100).toFixed(1) : "0"}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sales Revenue</span>
                <span className="font-medium">KES {stats?.totalRevenue?.toLocaleString() || "0"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Cost</span>
                <span className="font-medium">KES {stats?.totalCost?.toLocaleString() || "0"}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-sm font-medium">Net Profit</span>
                <span className="font-bold text-green-600">KES {stats?.profit?.toLocaleString() || "0"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending Orders</span>
                <span className="font-medium">{stats?.pending || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Customers</span>
                <span className="font-medium">{customerStats?.activeCustomers || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

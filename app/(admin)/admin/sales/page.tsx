"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, Receipt, TrendingUp, Calendar, Download, Filter } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

export default function SalesPage() {
  const sales = useQuery(api.products.getSalesWithProducts) || []
  const salesStats = useQuery(api.products.getStats)
  const categories = useQuery(api.categories.list) || []

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c._id === categoryId)
    return category?.name || "Unknown Category"
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sales</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Sales Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesStats?.totalSales || 0}</div>
            <p className="text-xs text-muted-foreground">Completed transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {salesStats?.totalRevenue?.toLocaleString() || "0"}</div>
            <p className="text-xs text-muted-foreground">From all sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">KES {salesStats?.profit?.toLocaleString() || "0"}</div>
            <p className="text-xs text-muted-foreground">Revenue - Cost</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Sale Value</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {salesStats?.avgSaleValue?.toFixed(0) || "0"}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Sales History
          </CardTitle>
          <CardDescription>All completed sales transactions (paid orders only)</CardDescription>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No sales yet</h3>
              <p className="text-muted-foreground">Sales will appear here when orders are marked as sold.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Sale Amount</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead className="hidden md:table-cell">Sale Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Destination</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => {
                  const saleAmount = (sale.product?.basePrice || 0) + sale.deliveryFee
                  const profit = saleAmount - (sale.product?.costPrice || 0)
                  const category = categories.find((c) => c._id === sale.product?.categoryId)
                  return (
                    <TableRow key={sale._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{sale.customerName}</div>
                          <div className="text-sm text-muted-foreground">{sale.customerPhone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{sale.product?.name || "Unknown Product"}</div>
                          <div className="text-sm text-muted-foreground">
                            <Badge variant="outline">{category?.name || "Unknown"}</Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">KES {saleAmount.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">
                            Price: {sale.product?.basePrice?.toLocaleString() || 0} + Delivery:{" "}
                            {sale.deliveryFee.toLocaleString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                          KES {profit.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {sale.dateStockSold ? formatDate(sale.dateStockSold) : "N/A"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {sale.deliveryDestination || "Not specified"}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Sold</Badge>
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

import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("products").order("desc").collect()
  },
})

export const listByStatus = query({
  args: { status: v.union(v.literal("in_stock"), v.literal("sold"), v.literal("pending")) },
  handler: async (ctx, { status }) => {
    return await ctx.db
      .query("products")
      .withIndex("by_status", (q) => q.eq("status", status))
      .collect()
  },
})

// Get all sales (orders with "sold" status)
export const getSales = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .withIndex("by_status", (q) => q.eq("status", "sold"))
      .order("desc")
      .collect()
  },
})

export const create = mutation({
  args: {
    productCatalogId: v.id("productCatalog"),
    customerId: v.optional(v.id("customers")),
    customerName: v.string(),
    customerPhone: v.string(),
    customerEmail: v.string(),
    customerAddress: v.string(),
    deliveryFee: v.number(),
    deliveryDestination: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get product details from catalog
    const product = await ctx.db.get(args.productCatalogId)
    if (!product) {
      throw new Error("Product not found in catalog")
    }

    // Check if product is active
    if (!product.isActive) {
      throw new Error("Product is not active")
    }

    // Check if product is in stock (but don't reduce stock yet - only when sold)
    if (product.stockQuantity <= 0) {
      throw new Error(`${product.name} is out of stock`)
    }

    // If customerId is provided, update customer stats
    if (args.customerId) {
      const customer = await ctx.db.get(args.customerId)
      if (customer) {
        await ctx.db.patch(args.customerId, {
          totalOrders: customer.totalOrders + 1,
        })
      }
    }

    return await ctx.db.insert("products", {
      ...args,
      status: "in_stock" as const,
      createdAt: Date.now(),
    })
  },
})

// Add a query to get orders with product details
export const listWithProducts = query({
  handler: async (ctx) => {
    const orders = await ctx.db.query("products").order("desc").collect()

    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const product = await ctx.db.get(order.productCatalogId)
        return {
          ...order,
          product,
        }
      }),
    )

    return ordersWithProducts
  },
})

// Update the getSales query to include product details
export const getSalesWithProducts = query({
  handler: async (ctx) => {
    const sales = await ctx.db
      .query("products")
      .withIndex("by_status", (q) => q.eq("status", "sold"))
      .order("desc")
      .collect()

    const salesWithProducts = await Promise.all(
      sales.map(async (sale) => {
        const product = await ctx.db.get(sale.productCatalogId)
        return {
          ...sale,
          product,
        }
      }),
    )

    return salesWithProducts
  },
})

export const update = mutation({
  args: {
    id: v.id("products"),
    customerId: v.optional(v.id("customers")),
    customerName: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    customerAddress: v.optional(v.string()),
    deliveryFee: v.optional(v.number()),
    deliveryDestination: v.optional(v.string()),
    dateStockSold: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.optional(v.union(v.literal("in_stock"), v.literal("sold"), v.literal("pending"))),
  },
  handler: async (ctx, { id, ...updates }) => {
    return await ctx.db.patch(id, updates)
  },
})

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    // When deleting an order that hasn't been sold, we don't need to restore stock
    // since we never reduced it in the first place
    return await ctx.db.delete(id)
  },
})

export const markAsSold = mutation({
  args: {
    id: v.id("products"),
    dateStockSold: v.string(),
  },
  handler: async (ctx, { id, dateStockSold }) => {
    const order = await ctx.db.get(id)
    if (!order) throw new Error("Order not found")

    // Get product details for pricing and stock management
    const product = await ctx.db.get(order.productCatalogId)
    if (!product) throw new Error("Product not found in catalog")

    // Check if product still has stock before marking as sold
    if (product.stockQuantity <= 0) {
      throw new Error(`Cannot complete sale: ${product.name} is out of stock`)
    }

    // NOW reduce stock quantity when marking as sold
    await ctx.db.patch(order.productCatalogId, {
      stockQuantity: product.stockQuantity - 1,
    })

    // Update customer stats if customer exists
    if (order.customerId) {
      const customer = await ctx.db.get(order.customerId)
      if (customer) {
        const totalSpent = product.basePrice + order.deliveryFee
        await ctx.db.patch(order.customerId, {
          totalSpent: customer.totalSpent + totalSpent,
          lastOrderDate: dateStockSold,
        })
      }
    }

    return await ctx.db.patch(id, {
      status: "sold" as const,
      dateStockSold,
    })
  },
})

export const getStats = query({
  handler: async (ctx) => {
    const orders = await ctx.db.query("products").collect()
    const sales = orders.filter((o) => o.status === "sold")
    const categories = await ctx.db.query("categories").collect()

    // Get product details for calculations
    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const product = await ctx.db.get(order.productCatalogId)
        return { ...order, product }
      }),
    )

    const salesWithProducts = await Promise.all(
      sales.map(async (sale) => {
        const product = await ctx.db.get(sale.productCatalogId)
        return { ...sale, product }
      }),
    )

    // Order stats
    const totalOrders = orders.length
    const inStock = orders.filter((o) => o.status === "in_stock").length
    const sold = sales.length
    const pending = orders.filter((o) => o.status === "pending").length

    // Sales stats (revenue only from sold items)
    const totalRevenue = salesWithProducts.reduce((sum, s) => {
      return sum + (s.product?.basePrice || 0) + s.deliveryFee
    }, 0)

    const totalCost = salesWithProducts.reduce((sum, s) => {
      return sum + (s.product?.costPrice || 0)
    }, 0)

    const profit = totalRevenue - totalCost

    // Category breakdown - orders vs sales (fixed to use product.categoryId)
    const categoryOrderStats: Record<string, number> = {}
    const categorySalesStats: Record<string, number> = {}

    categories.forEach((category) => {
      categoryOrderStats[category.name] = ordersWithProducts.filter(
        (o) => o.product?.categoryId === category._id,
      ).length
      categorySalesStats[category.name] = salesWithProducts.filter((s) => s.product?.categoryId === category._id).length
    })

    // Averages
    const avgOrderValue =
      ordersWithProducts.length > 0
        ? ordersWithProducts.reduce((sum, o) => sum + (o.product?.basePrice || 0) + o.deliveryFee, 0) /
          ordersWithProducts.length
        : 0

    const avgSaleValue = salesWithProducts.length > 0 ? totalRevenue / salesWithProducts.length : 0
    const avgDeliveryFee = orders.length > 0 ? orders.reduce((sum, o) => sum + o.deliveryFee, 0) / orders.length : 0

    return {
      // Order metrics
      totalOrders,
      inStock,
      sold,
      pending,
      categoryOrderStats,
      avgOrderValue,

      // Sales metrics
      totalSales: sold,
      totalRevenue,
      totalCost,
      profit,
      categorySalesStats,
      avgSaleValue,
      avgDeliveryFee,

      // Legacy compatibility
      totalProducts: totalOrders,
      avgPrice: avgOrderValue,
    }
  },
})

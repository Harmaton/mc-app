import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("customers").order("desc").collect()
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if customer with email already exists
    const existing = await ctx.db
      .query("customers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()

    if (existing) {
      throw new Error("Customer with this email already exists")
    }

    return await ctx.db.insert("customers", {
      ...args,
      totalOrders: 0,
      totalSpent: 0,
      status: "active" as const,
      joinDate: new Date().toISOString().split("T")[0],
      createdAt: Date.now(),
    })
  },
})

export const update = mutation({
  args: {
    id: v.id("customers"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
  },
  handler: async (ctx, { id, ...updates }) => {
    return await ctx.db.patch(id, updates)
  },
})

export const remove = mutation({
  args: { id: v.id("customers") },
  handler: async (ctx, { id }) => {
    return await ctx.db.delete(id)
  },
})

export const updateStats = mutation({
  args: {
    id: v.id("customers"),
    orderAmount: v.number(),
    orderDate: v.string(),
  },
  handler: async (ctx, { id, orderAmount, orderDate }) => {
    const customer = await ctx.db.get(id)
    if (!customer) throw new Error("Customer not found")

    return await ctx.db.patch(id, {
      totalOrders: customer.totalOrders + 1,
      totalSpent: customer.totalSpent + orderAmount,
      lastOrderDate: orderDate,
    })
  },
})

export const getStats = query({
  handler: async (ctx) => {
    const customers = await ctx.db.query("customers").collect()
    const totalCustomers = customers.length
    const activeCustomers = customers.filter((c) => c.status === "active").length
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
    const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0)
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    return {
      totalCustomers,
      activeCustomers,
      totalRevenue,
      avgOrderValue,
    }
  },
})

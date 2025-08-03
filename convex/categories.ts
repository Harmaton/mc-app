import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("categories").order("desc").collect()
  },
})

export const listActive = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .collect()
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("categories", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    })
  },
})

export const update = mutation({
  args: {
    id: v.id("categories"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...updates }) => {
    return await ctx.db.patch(id, updates)
  },
})

export const remove = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, { id }) => {
    return await ctx.db.delete(id)
  },
})

export const getStats = query({
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect()
    const activeCategories = categories.filter((c) => c.isActive).length
    const totalCategories = categories.length

    return {
      totalCategories,
      activeCategories,
      inactiveCategories: totalCategories - activeCategories,
    }
  },
})

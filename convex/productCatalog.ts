import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("productCatalog").order("desc").collect()
  },
})

export const listActive = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("productCatalog")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .collect()
  },
})

export const listByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, { categoryId }) => {
    return await ctx.db
      .query("productCatalog")
      .withIndex("by_category", (q) => q.eq("categoryId", categoryId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect()
  },
})

export const listFeatured = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("productCatalog")
      .filter((q) => q.and(q.eq(q.field("isActive"), true), q.eq(q.field("isFeatured"), true)))
      .order("desc")
      .collect()
  },
})

// Get product by slug for storefront
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("productCatalog")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first()
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    categoryId: v.id("categories"),
    basePrice: v.number(),
    costPrice: v.number(),
    sku: v.string(),
    colors: v.array(v.string()),
    sizes: v.array(v.string()),
    materials: v.array(v.string()),
    dimensions: v.object({
      length: v.number(),
      width: v.number(),
      height: v.number(),
    }),
    weight: v.number(),
    stockQuantity: v.number(),
    minStockLevel: v.number(),
    imageUrls: v.array(v.string()),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Auto-generate slug from product name
    const baseSlug = args.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

    // Ensure slug is unique
    let slug = baseSlug
    let counter = 1
    while (true) {
      const existingSlug = await ctx.db
        .query("productCatalog")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first()

      if (!existingSlug) break

      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Check if SKU already exists
    const existingSku = await ctx.db
      .query("productCatalog")
      .withIndex("by_sku", (q) => q.eq("sku", args.sku))
      .first()

    if (existingSku) {
      throw new Error("Product with this SKU already exists")
    }

    return await ctx.db.insert("productCatalog", {
      ...args,
      slug,
      isActive: true,
      isFeatured: false,
      createdAt: Date.now(),
    })
  },
})

export const update = mutation({
  args: {
    id: v.id("productCatalog"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    slug: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    basePrice: v.optional(v.number()),
    costPrice: v.optional(v.number()),
    sku: v.optional(v.string()),
    colors: v.optional(v.array(v.string())),
    sizes: v.optional(v.array(v.string())),
    materials: v.optional(v.array(v.string())),
    dimensions: v.optional(
      v.object({
        length: v.number(),
        width: v.number(),
        height: v.number(),
      }),
    ),
    weight: v.optional(v.number()),
    stockQuantity: v.optional(v.number()),
    minStockLevel: v.optional(v.number()),
    imageUrls: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, slug, sku, ...updates }) => {
    // Check if slug is being updated and is unique
    if (slug) {
      const existingSlug = await ctx.db
        .query("productCatalog")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first()

      if (existingSlug && existingSlug._id !== id) {
        throw new Error("Product with this slug already exists")
      }
    }

    // Check if SKU is being updated and is unique
    if (sku) {
      const existingSku = await ctx.db
        .query("productCatalog")
        .withIndex("by_sku", (q) => q.eq("sku", sku))
        .first()

      if (existingSku && existingSku._id !== id) {
        throw new Error("Product with this SKU already exists")
      }
    }

    return await ctx.db.patch(id, { slug, sku, ...updates })
  },
})

export const remove = mutation({
  args: { id: v.id("productCatalog") },
  handler: async (ctx, { id }) => {
    return await ctx.db.delete(id)
  },
})

export const updateStock = mutation({
  args: {
    id: v.id("productCatalog"),
    quantity: v.number(),
  },
  handler: async (ctx, { id, quantity }) => {
    const product = await ctx.db.get(id)
    if (!product) throw new Error("Product not found")

    return await ctx.db.patch(id, {
      stockQuantity: Math.max(0, product.stockQuantity + quantity),
    })
  },
})

export const getStats = query({
  handler: async (ctx) => {
    const products = await ctx.db.query("productCatalog").collect()

    const totalProducts = products.length
    const activeProducts = products.filter((p) => p.isActive).length
    const featuredProducts = products.filter((p) => p.isFeatured).length
    const lowStockProducts = products.filter((p) => p.stockQuantity <= p.minStockLevel && p.stockQuantity > 0).length
    const outOfStockProducts = products.filter((p) => p.stockQuantity === 0).length

    // Calculate average profit margin
    const totalMargin = products.reduce((sum, p) => {
      const margin = p.basePrice > 0 ? ((p.basePrice - p.costPrice) / p.basePrice) * 100 : 0
      return sum + margin
    }, 0)
    const avgProfitMargin = products.length > 0 ? totalMargin / products.length : 0

    // Total inventory value
    const totalInventoryValue = products.reduce((sum, p) => sum + p.stockQuantity * p.costPrice, 0)
    const totalRetailValue = products.reduce((sum, p) => sum + p.stockQuantity * p.basePrice, 0)

    return {
      totalProducts,
      activeProducts,
      featuredProducts,
      lowStockProducts,
      outOfStockProducts,
      avgProfitMargin,
      totalInventoryValue,
      totalRetailValue,
    }
  },
})

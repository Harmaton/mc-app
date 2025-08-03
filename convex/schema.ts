import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  categories: defineTable({
    name: v.string(),
    description: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
  }),

  productCatalog: defineTable({
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
    isActive: v.boolean(),
    isFeatured: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_category", ["categoryId"])
    .index("by_sku", ["sku"])
    .index("by_active", ["isActive"])
    .index("by_featured", ["isFeatured"]),

  products: defineTable({
    // Product Catalog Reference
    productCatalogId: v.id("productCatalog"), // Reference to the product in catalog

    // Customer Details (can be linked to customers table)
    customerId: v.optional(v.id("customers")),
    customerName: v.string(),
    customerPhone: v.string(),
    customerEmail: v.string(),
    customerAddress: v.string(),

    // Order-specific details (not in catalog)
    deliveryFee: v.number(),
    deliveryDestination: v.string(),
    dateStockSold: v.optional(v.string()),
    notes: v.optional(v.string()),

    // Status and tracking
    status: v.union(v.literal("in_stock"), v.literal("sold"), v.literal("pending")),
    createdAt: v.number(),
  })
    .index("by_product", ["productCatalogId"])
    .index("by_customer", ["customerId"])
    .index("by_customer_phone", ["customerPhone"])
    .index("by_status", ["status"]),

  customers: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    totalOrders: v.number(),
    totalSpent: v.number(),
    lastOrderDate: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    joinDate: v.string(),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_phone", ["phone"]),

  whatsappConfig: defineTable({
    accessToken: v.string(),
    phoneNumberId: v.string(),
    businessAccountId: v.string(),
    webhookUrl: v.string(),
    isConnected: v.boolean(),
    updatedAt: v.number(),
  }),

  messageTemplates: defineTable({
    name: v.string(),
    category: v.string(),
    language: v.string(),
    status: v.union(v.literal("approved"), v.literal("pending"), v.literal("rejected")),
    content: v.string(),
    createdAt: v.number(),
  }),

  sentMessages: defineTable({
    recipient: v.string(),
    customerId: v.optional(v.id("customers")),
    template: v.string(),
    templateId: v.id("messageTemplates"),
    parameters: v.optional(v.string()),
    status: v.union(v.literal("sent"), v.literal("delivered"), v.literal("read"), v.literal("failed")),
    sentAt: v.string(),
    createdAt: v.number(),
  }).index("by_customer", ["customerId"]),
})

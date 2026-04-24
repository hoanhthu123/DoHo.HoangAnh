import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tickets: defineTable({
    ticketCode: v.string(),
    customer: v.string(),
    phone: v.string(),
    brand: v.string(),
    model: v.optional(v.string()),
    issue: v.string(),
    note: v.optional(v.string()),
    watchImage: v.optional(v.string()),
    price: v.optional(v.number()),
    status: v.union(
      v.literal("received"),
      v.literal("repairing"),
      v.literal("ready"),
      v.literal("picked"),
    ),
    received: v.string(),
    promised: v.string(),
    finished: v.optional(v.union(v.string(), v.null())),
  })
    .index("by_ticketCode", ["ticketCode"])
    .index("by_status", ["status"]),
});

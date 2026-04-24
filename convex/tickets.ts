import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(args.limit ?? 300, 1), 500);
    return await ctx.db.query("tickets").order("desc").take(limit);
  },
});

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const exists = await ctx.db
      .query("tickets")
      .withIndex("by_ticketCode", (q) => q.eq("ticketCode", args.ticketCode))
      .unique();
    if (exists) {
      throw new Error(`Ticket code already exists: ${args.ticketCode}`);
    }
    const id = await ctx.db.insert("tickets", {
      ticketCode: args.ticketCode,
      customer: args.customer,
      phone: args.phone,
      brand: args.brand,
      model: args.model,
      issue: args.issue,
      note: args.note,
      watchImage: args.watchImage,
      price: args.price,
      status: args.status,
      received: args.received,
      promised: args.promised,
      finished: args.finished ?? null,
    });
    return await ctx.db.get(id);
  },
});

export const advance = mutation({
  args: { ticketCode: v.string() },
  handler: async (ctx, args) => {
    const ticket = await ctx.db
      .query("tickets")
      .withIndex("by_ticketCode", (q) => q.eq("ticketCode", args.ticketCode))
      .unique();
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const flow = ["received", "repairing", "ready", "picked"] as const;
    const idx = flow.indexOf(ticket.status);
    const next = idx >= 0 ? flow[idx + 1] : null;
    if (!next) return ticket;

    await ctx.db.patch(ticket._id, {
      status: next,
      finished: next === "ready" ? new Date().toISOString() : ticket.finished ?? null,
    });

    return await ctx.db.get(ticket._id);
  },
});

export const remove = mutation({
  args: { ticketCode: v.string() },
  handler: async (ctx, args) => {
    const ticket = await ctx.db
      .query("tickets")
      .withIndex("by_ticketCode", (q) => q.eq("ticketCode", args.ticketCode))
      .unique();
    if (!ticket) return { ok: true };
    await ctx.db.delete(ticket._id);
    return { ok: true };
  },
});

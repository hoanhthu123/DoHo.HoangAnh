import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

function withCors(response: Response) {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  return new Response(response.body, { status: response.status, headers });
}

function jsonResponse(data: unknown, status = 200) {
  return withCors(
    new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

async function parseJson(req: Request) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

const optionsHandler = httpAction(async () => {
  return withCors(new Response(null, { status: 204 }));
});

http.route({ path: "/tickets", method: "OPTIONS", handler: optionsHandler });
http.route({ path: "/tickets/advance", method: "OPTIONS", handler: optionsHandler });
http.route({ path: "/tickets/delete", method: "OPTIONS", handler: optionsHandler });
http.route({ path: "/tickets/status", method: "OPTIONS", handler: optionsHandler });

http.route({
  path: "/tickets",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const tickets = await ctx.runQuery(api.tickets.list, { limit: 300 });
    return jsonResponse({ tickets });
  }),
});

http.route({
  path: "/tickets",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await parseJson(req);
    if (!body || typeof body !== "object") {
      return jsonResponse({ error: "Invalid body" }, 400);
    }

    try {
      const created = await ctx.runMutation(api.tickets.create, {
        ticketCode: String((body as Record<string, unknown>).ticketCode || ""),
        customer: String((body as Record<string, unknown>).customer || ""),
        phone: String((body as Record<string, unknown>).phone || ""),
        brand: String((body as Record<string, unknown>).brand || ""),
        model: (body as Record<string, unknown>).model
          ? String((body as Record<string, unknown>).model)
          : undefined,
        issue: String((body as Record<string, unknown>).issue || ""),
        note: (body as Record<string, unknown>).note
          ? String((body as Record<string, unknown>).note)
          : undefined,
        watchImage: (body as Record<string, unknown>).watchImage
          ? String((body as Record<string, unknown>).watchImage)
          : undefined,
        price: typeof (body as Record<string, unknown>).price === "number"
          ? ((body as Record<string, unknown>).price as number)
          : undefined,
        status: String((body as Record<string, unknown>).status || "received") as
          | "received"
          | "repairing"
          | "ready"
          | "picked",
        received: String((body as Record<string, unknown>).received || new Date().toISOString()),
        promised: String((body as Record<string, unknown>).promised || new Date().toISOString()),
        finished: (body as Record<string, unknown>).finished
          ? String((body as Record<string, unknown>).finished)
          : null,
      });
      return jsonResponse({ ticket: created }, 201);
    } catch (err) {
      return jsonResponse({ error: err instanceof Error ? err.message : "Create failed" }, 400);
    }
  }),
});

http.route({
  path: "/tickets/advance",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await parseJson(req);
    const ticketCode = String((body as Record<string, unknown> | null)?.ticketCode || "").trim();
    if (!ticketCode) return jsonResponse({ error: "ticketCode is required" }, 400);

    try {
      const ticket = await ctx.runMutation(api.tickets.advance, { ticketCode });
      return jsonResponse({ ticket });
    } catch (err) {
      return jsonResponse({ error: err instanceof Error ? err.message : "Advance failed" }, 400);
    }
  }),
});

http.route({
  path: "/tickets/delete",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await parseJson(req);
    const ticketCode = String((body as Record<string, unknown> | null)?.ticketCode || "").trim();
    if (!ticketCode) return jsonResponse({ error: "ticketCode is required" }, 400);

    await ctx.runMutation(api.tickets.remove, { ticketCode });
    return jsonResponse({ ok: true });
  }),
});

http.route({
  path: "/tickets/status",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await parseJson(req);
    const ticketCode = String((body as Record<string, unknown> | null)?.ticketCode || "").trim();
    const status = String((body as Record<string, unknown> | null)?.status || "").trim();

    if (!ticketCode) return jsonResponse({ error: "ticketCode is required" }, 400);
    if (!["received", "repairing", "ready", "picked"].includes(status)) {
      return jsonResponse({ error: "Invalid status" }, 400);
    }

    try {
      const ticket = await ctx.runMutation(api.tickets.setStatus, {
        ticketCode,
        status: status as "received" | "repairing" | "ready" | "picked",
      });
      return jsonResponse({ ticket });
    } catch (err) {
      return jsonResponse({ error: err instanceof Error ? err.message : "Set status failed" }, 400);
    }
  }),
});

export default http;

import { Router, type Request, type Response } from "express";
import { db, subscriptionsTable, webhookLogsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const caktoRouter = Router();

const ACTIVE_EVENTS = new Set([
  "purchase_approved",
  "subscription_created",
  "subscription_renewed",
]);

const STATUS_MAP: Record<string, string> = {
  purchase_approved: "active",
  subscription_created: "active",
  subscription_renewed: "active",
  subscription_canceled: "canceled",
  subscription_renewal_refused: "payment_failed",
  purchase_refused: "payment_failed",
  refund: "refunded",
  chargeback: "chargeback",
};

caktoRouter.post("/cakto/webhook", async (req: Request, res: Response) => {
  const body = req.body ?? {};

  // Validate secret immediately — respond 401 if wrong but still log attempt
  const webhookSecret = process.env["CAKTO_WEBHOOK_SECRET"];
  if (!webhookSecret || body.secret !== webhookSecret) {
    // Log the rejected attempt without storing the secret value
    try {
      await db.insert(webhookLogsTable).values({
        eventType: body.event ?? "unknown",
        caktoOrderId: body.data?.id ?? null,
        payload: { ...body, secret: "[REDACTED]" },
        processed: false,
        errorMessage: "Invalid or missing webhook secret",
      });
    } catch (_) {
      // Swallow — never let a DB error change the 401 response
    }
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const event: string = body.event ?? "";
  const data = body.data ?? {};
  const orderId: string = data.id ?? "";

  // Respond 200 immediately — heavy processing below is best-effort
  res.status(200).json({ ok: true });

  // Async processing — errors cannot bubble back to the client
  try {
    // Idempotency: skip if this (orderId + event) was already processed successfully
    if (orderId) {
      const existing = await db
        .select({ id: webhookLogsTable.id })
        .from(webhookLogsTable)
        .where(
          and(
            eq(webhookLogsTable.caktoOrderId, orderId),
            eq(webhookLogsTable.eventType, event),
            eq(webhookLogsTable.processed, true),
          ),
        )
        .limit(1);

      if (existing.length > 0) return;
    }

    // Determine new status
    const newStatus = STATUS_MAP[event];
    if (!newStatus) {
      await db.insert(webhookLogsTable).values({
        eventType: event,
        caktoOrderId: orderId || null,
        payload: { ...body, secret: "[REDACTED]" },
        processed: false,
        errorMessage: `Unknown event type: ${event}`,
      });
      return;
    }

    const email = (data.customer?.email ?? "").toLowerCase().trim();
    if (!email) {
      await db.insert(webhookLogsTable).values({
        eventType: event,
        caktoOrderId: orderId || null,
        payload: { ...body, secret: "[REDACTED]" },
        processed: false,
        errorMessage: "Missing customer email",
      });
      return;
    }

    // Calculate paidUntil: +30 days for active events, null for others
    const paidUntil =
      ACTIVE_EVENTS.has(event)
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : null;

    const canceledAt =
      newStatus === "canceled" ? new Date() : undefined;

    // Upsert subscription by email
    const [existing] = await db
      .select()
      .from(subscriptionsTable)
      .where(eq(subscriptionsTable.email, email))
      .limit(1);

    if (existing) {
      await db
        .update(subscriptionsTable)
        .set({
          status: newStatus,
          paidUntil,
          canceledAt: canceledAt ?? existing.canceledAt,
          caktoOrderId: orderId || existing.caktoOrderId,
          caktoRefId: data.refId ?? existing.caktoRefId,
          planName: data.product?.name ?? existing.planName,
          updatedAt: new Date(),
        })
        .where(eq(subscriptionsTable.email, email));
    } else {
      await db.insert(subscriptionsTable).values({
        email,
        userId: null,
        caktoOrderId: orderId || null,
        caktoRefId: data.refId ?? null,
        planName: data.product?.name ?? null,
        status: newStatus,
        paidUntil,
        canceledAt: canceledAt ?? null,
      });
    }

    // Log success
    await db.insert(webhookLogsTable).values({
      eventType: event,
      caktoOrderId: orderId || null,
      payload: { ...body, secret: "[REDACTED]" },
      processed: true,
      errorMessage: null,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    try {
      await db.insert(webhookLogsTable).values({
        eventType: event,
        caktoOrderId: orderId || null,
        payload: { ...body, secret: "[REDACTED]" },
        processed: false,
        errorMessage: msg,
      });
    } catch (_) {
      // Final safety net — never throw from webhook handler
    }
  }
});

// GET /api/cakto/subscription?email=... — check subscription status for a clinic
caktoRouter.get("/cakto/subscription", async (req: Request, res: Response) => {
  try {
    const email = (req.query.email as string ?? "").trim().toLowerCase();
    if (!email) {
      res.status(400).json({ error: "email query param required" });
      return;
    }
    const { checkUserSubscription } = await import("../lib/subscription");
    const result = await checkUserSubscription(email);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default caktoRouter;

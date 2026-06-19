import { Router } from "express";

const router = Router();

/** In-memory subscription store (persists while server is running).
 *  In production this would be a real database update. */
const subscriptions: Record<string, { status: string; updatedAt: string }> = {};

router.post(
  "/api/webhook/stripe",
  // Stripe requires the raw body for signature verification.
  // express.raw() is applied per-route so other routes keep express.json().
  (req, res, next) => {
    let rawBody = "";
    req.setEncoding("utf8");
    req.on("data", (chunk: string) => { rawBody += chunk; });
    req.on("end", () => {
      (req as typeof req & { rawBody: string }).rawBody = rawBody;
      next();
    });
  },
  (req, res) => {
    const stripeSignature = req.headers["stripe-signature"];

    // Parse body (raw or already parsed by express.json upstream)
    let event: Record<string, unknown>;
    try {
      const rawBody = (req as typeof req & { rawBody?: string }).rawBody ?? JSON.stringify(req.body);
      event = JSON.parse(rawBody) as Record<string, unknown>;
    } catch {
      req.log.error("Stripe webhook: failed to parse body");
      res.status(400).json({ error: "Invalid JSON" });
      return;
    }

    const eventType = (event.type as string) ?? "unknown";
    const eventId   = (event.id   as string) ?? "-";

    req.log.info({ eventId, eventType, hasSignature: !!stripeSignature },
      "Stripe webhook received");

    // Handle relevant event types
    const dataObj = (event.data as Record<string, unknown>)?.object as Record<string, unknown> | undefined;
    const customerId       = (dataObj?.customer as string) ?? null;
    const subscriptionId   = (dataObj?.id       as string) ?? null;
    const subscriptionStatus = (dataObj?.status as string) ?? null;

    switch (eventType) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        if (subscriptionId && subscriptionStatus) {
          subscriptions[subscriptionId] = {
            status: subscriptionStatus,
            updatedAt: new Date().toISOString(),
          };
          req.log.info(
            { subscriptionId, subscriptionStatus, customerId },
            "Stripe webhook: subscription_status updated to '%s'",
            subscriptionStatus,
          );
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const sid = (dataObj?.subscription as string) ?? null;
        if (sid) {
          subscriptions[sid] = { status: "active", updatedAt: new Date().toISOString() };
          req.log.info(
            { subscriptionId: sid, customerId },
            "Stripe webhook: invoice paid — subscription_status forced to 'active'",
          );
        }
        break;
      }

      case "invoice.payment_failed": {
        const sid = (dataObj?.subscription as string) ?? null;
        if (sid) {
          subscriptions[sid] = { status: "past_due", updatedAt: new Date().toISOString() };
          req.log.warn(
            { subscriptionId: sid, customerId },
            "Stripe webhook: invoice payment failed — subscription_status set to 'past_due'",
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        if (subscriptionId) {
          subscriptions[subscriptionId] = { status: "canceled", updatedAt: new Date().toISOString() };
          req.log.info(
            { subscriptionId, customerId },
            "Stripe webhook: subscription canceled",
          );
        }
        break;
      }

      default:
        req.log.info({ eventType }, "Stripe webhook: unhandled event type (ignored)");
    }

    // Always acknowledge immediately — Stripe retries if we don't return 2xx
    res.status(200).json({ received: true });
  },
);

/** Read-only helper endpoint — returns current in-memory subscription states */
router.get("/api/webhook/stripe/subscriptions", (req, res) => {
  res.json(subscriptions);
});

export default router;

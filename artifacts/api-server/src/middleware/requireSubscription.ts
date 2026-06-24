import { type Request, type Response, type NextFunction } from "express";
import { checkUserSubscription } from "../lib/subscription";
import { db, clinicsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

/**
 * Middleware that blocks access to clinic routes if the owner's subscription
 * is not active. Resolves the owner email via the clinic slug in the URL.
 *
 * Apply after any route that has :slug in the path.
 */
export async function requireSubscription(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const slug = req.params["slug"];
    if (!slug) {
      next();
      return;
    }

    const [clinic] = await db
      .select({ ownerEmail: clinicsTable.ownerEmail })
      .from(clinicsTable)
      .where(eq(clinicsTable.slug, slug))
      .limit(1);

    if (!clinic?.ownerEmail) {
      // Clinic not found — let the route handler return 404
      next();
      return;
    }

    const { canAccess, status } = await checkUserSubscription(clinic.ownerEmail);

    if (!canAccess) {
      res.status(402).json({
        error: "subscription_required",
        status,
        message: "Sua assinatura não está ativa. Acesse a plataforma para regularizar.",
      });
      return;
    }

    next();
  } catch {
    // On infra error, don't block — let the request through
    next();
  }
}

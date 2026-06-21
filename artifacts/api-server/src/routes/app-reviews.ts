import { Router, type Request, type Response } from "express";
import { db, appReviewsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const appReviewsRouter = Router();

appReviewsRouter.post("/app-reviews", async (req: Request, res: Response) => {
  try {
    const { clinicId, ownerEmail, rating, reviewText } = req.body;

    if (!clinicId || !ownerEmail || !rating) {
      res.status(400).json({ error: "clinicId, ownerEmail and rating are required" });
      return;
    }

    const ratingNum = Number(rating);
    if (ratingNum < 1 || ratingNum > 5) {
      res.status(400).json({ error: "rating must be between 1 and 5" });
      return;
    }

    // One review per clinic
    const [existing] = await db
      .select({ id: appReviewsTable.id })
      .from(appReviewsTable)
      .where(eq(appReviewsTable.clinicId, String(clinicId)))
      .limit(1);

    if (existing) {
      res.status(409).json({ error: "already_reviewed" });
      return;
    }

    const [review] = await db
      .insert(appReviewsTable)
      .values({
        clinicId: String(clinicId),
        ownerEmail: String(ownerEmail),
        rating: ratingNum,
        reviewText: reviewText ? String(reviewText) : null,
      })
      .returning();

    res.status(201).json(review);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default appReviewsRouter;

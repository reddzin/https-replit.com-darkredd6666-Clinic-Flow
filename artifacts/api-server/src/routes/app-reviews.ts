import { Router, type Request, type Response } from "express";
import { db, appReviewsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const ADMIN_EMAIL = "igorsilvaarcini1@hotmail.com";

const appReviewsRouter = Router();

// GET /api/app-reviews — admin only
appReviewsRouter.get("/app-reviews", async (req: Request, res: Response) => {
  const adminKey = req.headers["x-admin-key"];
  if (adminKey !== ADMIN_EMAIL) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  try {
    const reviews = await db
      .select()
      .from(appReviewsTable)
      .orderBy(desc(appReviewsTable.createdAt));
    res.json(reviews);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/app-reviews
appReviewsRouter.post("/app-reviews", async (req: Request, res: Response) => {
  try {
    const { clinicId, ownerEmail, rating, reviewText, photoUrl, videoUrl } = req.body;

    if (!clinicId || !ownerEmail || !rating) {
      res.status(400).json({ error: "clinicId, ownerEmail and rating are required" });
      return;
    }

    const ratingNum = Number(rating);
    if (ratingNum < 1 || ratingNum > 5) {
      res.status(400).json({ error: "rating must be between 1 and 5" });
      return;
    }

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
        photoUrl: photoUrl ? String(photoUrl) : null,
        videoUrl: videoUrl ? String(videoUrl) : null,
      })
      .returning();

    res.status(201).json(review);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default appReviewsRouter;

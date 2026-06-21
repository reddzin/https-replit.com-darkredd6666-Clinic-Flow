import { Router, type Request, type Response } from "express";
import { db, reviewTokensTable, reviewsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const reviewsRouter = Router();

function makeToken(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// POST /api/review-tokens — clinic creates a review request for a completed appointment
reviewsRouter.post("/review-tokens", async (req: Request, res: Response) => {
  try {
    const { clinicSlug, patientName, doctorName, appointmentDate, appointmentId } = req.body;
    if (!clinicSlug || !patientName || !doctorName || !appointmentDate) {
      res.status(400).json({ error: "clinicSlug, patientName, doctorName and appointmentDate are required" });
      return;
    }
    const token = makeToken();
    const [row] = await db.insert(reviewTokensTable).values({
      token,
      clinicSlug: String(clinicSlug),
      patientName: String(patientName),
      doctorName: String(doctorName),
      appointmentDate: String(appointmentDate),
      appointmentId: appointmentId ? String(appointmentId) : null,
    }).returning();
    res.json({ token: row.token });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/review-tokens/:token — patient fetches the consultation context
reviewsRouter.get("/review-tokens/:token", async (req: Request, res: Response) => {
  try {
    const [row] = await db.select().from(reviewTokensTable)
      .where(eq(reviewTokensTable.token, req.params.token)).limit(1);
    if (!row) { res.status(404).json({ error: "Token not found" }); return; }
    if (row.used) { res.status(410).json({ error: "Token already used" }); return; }
    res.json({
      token: row.token,
      clinicSlug: row.clinicSlug,
      patientName: row.patientName,
      doctorName: row.doctorName,
      appointmentDate: row.appointmentDate,
    });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/reviews — patient submits a review
reviewsRouter.post("/reviews", async (req: Request, res: Response) => {
  try {
    const { token, rating, reviewText, photoData, videoData } = req.body;
    if (!token || !rating || !reviewText) {
      res.status(400).json({ error: "token, rating and reviewText are required" });
      return;
    }
    const [tokenRow] = await db.select().from(reviewTokensTable)
      .where(eq(reviewTokensTable.token, String(token))).limit(1);
    if (!tokenRow) { res.status(404).json({ error: "Token not found" }); return; }
    if (tokenRow.used) { res.status(410).json({ error: "Token already used" }); return; }

    const [review] = await db.insert(reviewsTable).values({
      token: tokenRow.token,
      clinicSlug: tokenRow.clinicSlug,
      patientName: tokenRow.patientName,
      doctorName: tokenRow.doctorName,
      appointmentDate: tokenRow.appointmentDate,
      rating: Number(rating),
      reviewText: String(reviewText),
      photoData: photoData ?? null,
      videoData: videoData ?? null,
    }).returning();

    await db.update(reviewTokensTable)
      .set({ used: true })
      .where(eq(reviewTokensTable.token, String(token)));

    res.json(review);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/reviews/:clinicSlug — clinic fetches its reviews
reviewsRouter.get("/reviews/:clinicSlug", async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(reviewsTable)
      .where(eq(reviewsTable.clinicSlug, req.params.clinicSlug))
      .orderBy(desc(reviewsTable.createdAt));
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default reviewsRouter;

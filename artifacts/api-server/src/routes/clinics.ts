import { Router, type Request, type Response } from "express";
import { db, clinicsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const clinicsRouter = Router();

clinicsRouter.get("/clinics/:slug", async (req: Request, res: Response) => {
  try {
    const slug = (req.params.slug ?? "").trim().toLowerCase();
    const [clinic] = await db
      .select()
      .from(clinicsTable)
      .where(eq(clinicsTable.slug, slug))
      .limit(1);

    if (!clinic) {
      res.status(404).json({ error: "Clinic not found" });
      return;
    }

    res.json(clinic);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

clinicsRouter.post("/clinics", async (req: Request, res: Response) => {
  try {
    const {
      slug,
      clinicName,
      clinicType,
      clinicAddress,
      clinicPhone,
      clinicCity,
      clinicState,
      businessHours,
      doctors,
      appointmentDuration,
      ownerEmail,
    } = req.body;

    if (!slug || !clinicName) {
      res.status(400).json({ error: "slug and clinicName are required" });
      return;
    }

    const normalizedSlug = String(slug).trim().toLowerCase();

    const updateSet = {
      clinicName: String(clinicName),
      clinicType: clinicType ?? null,
      clinicAddress: clinicAddress ?? null,
      clinicPhone: clinicPhone ?? null,
      clinicCity: clinicCity ?? null,
      clinicState: clinicState ?? null,
      businessHours: businessHours ?? null,
      doctors: doctors ?? null,
      appointmentDuration: appointmentDuration ? Number(appointmentDuration) : null,
      ownerEmail: ownerEmail ?? null,
    };

    const [clinic] = await db
      .insert(clinicsTable)
      .values({ slug: normalizedSlug, ...updateSet })
      .onConflictDoUpdate({
        target: clinicsTable.slug,
        set: updateSet,
      })
      .returning();

    res.json(clinic);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default clinicsRouter;

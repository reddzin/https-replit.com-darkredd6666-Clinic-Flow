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

// PATCH /api/clinics/by-owner — update clinic by ownerEmail, safe for slug renames
clinicsRouter.patch("/clinics/by-owner", async (req: Request, res: Response) => {
  try {
    const {
      ownerEmail,
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
    } = req.body;

    if (!ownerEmail) {
      res.status(400).json({ error: "ownerEmail is required" });
      return;
    }

    // Build update set with only provided fields
    const updates: Record<string, unknown> = {};
    if (slug !== undefined) updates.slug = String(slug).trim().toLowerCase();
    if (clinicName !== undefined) updates.clinicName = String(clinicName);
    if (clinicType !== undefined) updates.clinicType = clinicType ?? null;
    if (clinicAddress !== undefined) updates.clinicAddress = clinicAddress ?? null;
    if (clinicPhone !== undefined) updates.clinicPhone = clinicPhone ?? null;
    if (clinicCity !== undefined) updates.clinicCity = clinicCity ?? null;
    if (clinicState !== undefined) updates.clinicState = clinicState ?? null;
    if (businessHours !== undefined) updates.businessHours = businessHours ?? null;
    if (doctors !== undefined) updates.doctors = doctors ?? null;
    if (appointmentDuration !== undefined)
      updates.appointmentDuration = appointmentDuration ? Number(appointmentDuration) : null;

    const [clinic] = await db
      .update(clinicsTable)
      .set(updates)
      .where(eq(clinicsTable.ownerEmail, String(ownerEmail)))
      .returning();

    if (!clinic) {
      res.status(404).json({ error: "Clinic not found for this owner" });
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

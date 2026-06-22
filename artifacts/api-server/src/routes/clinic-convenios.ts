import { Router, type Request, type Response } from "express";
import { db, clinicConveniosTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const clinicConveniosRouter = Router();

clinicConveniosRouter.get("/clinics/:slug/convenios", async (req: Request, res: Response) => {
  try {
    const slug = (req.params.slug ?? "").trim().toLowerCase();
    const convenios = await db
      .select()
      .from(clinicConveniosTable)
      .where(eq(clinicConveniosTable.clinicSlug, slug))
      .orderBy(clinicConveniosTable.createdAt);
    res.json(convenios);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

clinicConveniosRouter.post("/clinics/:slug/convenios", async (req: Request, res: Response) => {
  try {
    const slug = (req.params.slug ?? "").trim().toLowerCase();
    const { name, code } = req.body;

    if (!name) {
      res.status(400).json({ error: "name is required" });
      return;
    }

    const [convenio] = await db
      .insert(clinicConveniosTable)
      .values({
        clinicSlug: slug,
        name: String(name).trim(),
        code: code ? String(code).trim() : null,
        active: true,
      })
      .returning();

    res.status(201).json(convenio);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

clinicConveniosRouter.patch("/clinics/:slug/convenios/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { active } = req.body;

    const [updated] = await db
      .update(clinicConveniosTable)
      .set({ active: Boolean(active) })
      .where(eq(clinicConveniosTable.id, id))
      .returning();

    res.json(updated);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

clinicConveniosRouter.delete("/clinics/:slug/convenios/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(clinicConveniosTable).where(eq(clinicConveniosTable.id, id));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default clinicConveniosRouter;

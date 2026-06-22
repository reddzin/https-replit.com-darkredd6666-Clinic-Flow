import { Router, type Request, type Response } from "express";
import { db, clinicUsersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const clinicUsersRouter = Router();

clinicUsersRouter.get("/clinics/:slug/users", async (req: Request, res: Response) => {
  try {
    const slug = (req.params.slug ?? "").trim().toLowerCase();
    const users = await db
      .select()
      .from(clinicUsersTable)
      .where(eq(clinicUsersTable.clinicSlug, slug))
      .orderBy(clinicUsersTable.createdAt);
    res.json(users);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

clinicUsersRouter.post("/clinics/:slug/users", async (req: Request, res: Response) => {
  try {
    const slug = (req.params.slug ?? "").trim().toLowerCase();
    const { name, email, role, status } = req.body;

    if (!name || !email || !role) {
      res.status(400).json({ error: "name, email and role are required" });
      return;
    }

    const [user] = await db
      .insert(clinicUsersTable)
      .values({
        clinicSlug: slug,
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        role: String(role),
        status: status ? String(status) : "Ativo",
      })
      .returning();

    res.status(201).json(user);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

clinicUsersRouter.delete("/clinics/:slug/users/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(clinicUsersTable).where(eq(clinicUsersTable.id, id));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default clinicUsersRouter;

import { Router, type Request, type Response } from "express";
import { db, patientsTable, appointmentsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

const patientsRouter = Router();

function hashPassword(password: string, salt: string): string {
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

function getPatientFromRequest(req: Request) {
  const auth = req.headers.authorization ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : null;
  return token;
}

// POST /api/patients/register
patientsRouter.post("/patients/register", async (req: Request, res: Response) => {
  try {
    const { name, phone, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "name, email and password are required" });
      return;
    }

    const existing = await db
      .select()
      .from(patientsTable)
      .where(eq(patientsTable.email, email.toLowerCase().trim()))
      .limit(1);

    if (existing.length > 0) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const salt = generateSalt();
    const passwordHash = `${salt}:${hashPassword(password, salt)}`;
    const token = generateToken();

    const [patient] = await db
      .insert(patientsTable)
      .values({
        name: name.trim(),
        phone: phone?.trim() ?? null,
        email: email.toLowerCase().trim(),
        passwordHash,
        token,
      })
      .returning();

    res.json({ token, patient: { id: patient.id, name: patient.name, email: patient.email, phone: patient.phone } });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/patients/login
patientsRouter.post("/patients/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "email and password are required" });
      return;
    }

    const [patient] = await db
      .select()
      .from(patientsTable)
      .where(eq(patientsTable.email, email.toLowerCase().trim()))
      .limit(1);

    if (!patient) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const [salt, hash] = patient.passwordHash.split(":");
    if (hashPassword(password, salt) !== hash) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = generateToken();
    await db.update(patientsTable).set({ token }).where(eq(patientsTable.id, patient.id));

    res.json({ token, patient: { id: patient.id, name: patient.name, email: patient.email, phone: patient.phone } });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/patients/me
patientsRouter.get("/patients/me", async (req: Request, res: Response) => {
  try {
    const token = getPatientFromRequest(req);
    if (!token) { res.status(401).json({ error: "Unauthorized" }); return; }

    const [patient] = await db.select().from(patientsTable).where(eq(patientsTable.token, token)).limit(1);
    if (!patient) { res.status(401).json({ error: "Unauthorized" }); return; }

    res.json({ id: patient.id, name: patient.name, email: patient.email, phone: patient.phone });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/patients/appointments
patientsRouter.get("/patients/appointments", async (req: Request, res: Response) => {
  try {
    const token = getPatientFromRequest(req);
    if (!token) { res.status(401).json({ error: "Unauthorized" }); return; }

    const [patient] = await db.select().from(patientsTable).where(eq(patientsTable.token, token)).limit(1);
    if (!patient) { res.status(401).json({ error: "Unauthorized" }); return; }

    const appointments = await db
      .select()
      .from(appointmentsTable)
      .where(eq(appointmentsTable.patientEmail, patient.email))
      .orderBy(appointmentsTable.appointmentDate);

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/patients/appointments/:id/cancel
patientsRouter.patch("/patients/appointments/:id/cancel", async (req: Request, res: Response) => {
  try {
    const token = getPatientFromRequest(req);
    if (!token) { res.status(401).json({ error: "Unauthorized" }); return; }

    const [patient] = await db.select().from(patientsTable).where(eq(patientsTable.token, token)).limit(1);
    if (!patient) { res.status(401).json({ error: "Unauthorized" }); return; }

    const id = parseInt(req.params.id);
    const [appt] = await db
      .update(appointmentsTable)
      .set({ status: "cancelled" })
      .where(and(eq(appointmentsTable.id, id), eq(appointmentsTable.patientEmail, patient.email)))
      .returning();

    if (!appt) { res.status(404).json({ error: "Appointment not found" }); return; }
    res.json(appt);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/patients/appointments/:id/reschedule
patientsRouter.patch("/patients/appointments/:id/reschedule", async (req: Request, res: Response) => {
  try {
    const token = getPatientFromRequest(req);
    if (!token) { res.status(401).json({ error: "Unauthorized" }); return; }

    const [patient] = await db.select().from(patientsTable).where(eq(patientsTable.token, token)).limit(1);
    if (!patient) { res.status(401).json({ error: "Unauthorized" }); return; }

    const id = parseInt(req.params.id);
    const { appointmentDate, appointmentTime } = req.body;
    if (!appointmentDate || !appointmentTime) {
      res.status(400).json({ error: "appointmentDate and appointmentTime are required" });
      return;
    }

    const [appt] = await db
      .update(appointmentsTable)
      .set({ appointmentDate, appointmentTime, status: "scheduled" })
      .where(and(eq(appointmentsTable.id, id), eq(appointmentsTable.patientEmail, patient.email)))
      .returning();

    if (!appt) { res.status(404).json({ error: "Appointment not found" }); return; }
    res.json(appt);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/appointments — public, creates appointment (no auth required)
patientsRouter.post("/appointments", async (req: Request, res: Response) => {
  try {
    const { patientEmail, clinicSlug, clinicName, doctorId, doctorName, specialty, appointmentDate, appointmentTime, notes } = req.body;
    if (!patientEmail || !clinicSlug || !specialty || !appointmentDate || !appointmentTime) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const [appt] = await db
      .insert(appointmentsTable)
      .values({ patientEmail, clinicSlug, clinicName: clinicName ?? null, doctorId: doctorId ?? null, doctorName: doctorName ?? null, specialty, appointmentDate, appointmentTime, notes: notes ?? null })
      .returning();

    res.json(appt);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/patients/appointments/:id/mark-reviewed
patientsRouter.patch("/patients/appointments/:id/mark-reviewed", async (req: Request, res: Response) => {
  try {
    const token = getPatientFromRequest(req);
    if (!token) { res.status(401).json({ error: "Unauthorized" }); return; }

    const [patient] = await db.select().from(patientsTable).where(eq(patientsTable.token, token)).limit(1);
    if (!patient) { res.status(401).json({ error: "Unauthorized" }); return; }

    const id = parseInt(req.params.id);
    const [appt] = await db
      .update(appointmentsTable)
      .set({ reviewed: true })
      .where(and(eq(appointmentsTable.id, id), eq(appointmentsTable.patientEmail, patient.email)))
      .returning();

    if (!appt) { res.status(404).json({ error: "Appointment not found" }); return; }
    res.json(appt);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default patientsRouter;

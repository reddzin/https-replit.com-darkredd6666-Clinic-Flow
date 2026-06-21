import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";

export const appointmentsTable = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientEmail: text("patient_email").notNull(),
  clinicSlug: text("clinic_slug").notNull(),
  clinicName: text("clinic_name"),
  doctorId: text("doctor_id"),
  doctorName: text("doctor_name"),
  specialty: text("specialty").notNull(),
  appointmentDate: text("appointment_date").notNull(),
  appointmentTime: text("appointment_time").notNull(),
  status: text("status").notNull().default("scheduled"),
  reviewed: boolean("reviewed").notNull().default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

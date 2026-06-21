import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

export const clinicsTable = pgTable("clinics", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  clinicName: text("clinic_name").notNull(),
  clinicType: text("clinic_type"),
  clinicAddress: text("clinic_address"),
  clinicPhone: text("clinic_phone"),
  clinicCity: text("clinic_city"),
  clinicState: text("clinic_state"),
  businessHours: jsonb("business_hours"),
  doctors: jsonb("doctors"),
  appointmentDuration: integer("appointment_duration"),
  ownerEmail: text("owner_email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

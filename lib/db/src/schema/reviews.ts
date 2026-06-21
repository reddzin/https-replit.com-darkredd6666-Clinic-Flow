import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const reviewTokensTable = pgTable("review_tokens", {
  id: serial("id").primaryKey(),
  token: text("token").notNull().unique(),
  clinicSlug: text("clinic_slug").notNull(),
  patientName: text("patient_name").notNull(),
  doctorName: text("doctor_name").notNull(),
  appointmentDate: text("appointment_date").notNull(),
  appointmentId: text("appointment_id"),
  used: boolean("used").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  token: text("token").notNull().unique(),
  clinicSlug: text("clinic_slug").notNull(),
  patientName: text("patient_name").notNull(),
  doctorName: text("doctor_name").notNull(),
  appointmentDate: text("appointment_date").notNull(),
  rating: integer("rating").notNull(),
  reviewText: text("review_text").notNull(),
  photoData: text("photo_data"),
  videoData: text("video_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

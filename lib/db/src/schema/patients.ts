import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const patientsTable = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  token: text("token"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

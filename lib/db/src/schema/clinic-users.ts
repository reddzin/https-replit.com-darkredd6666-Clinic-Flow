import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const clinicUsersTable = pgTable("clinic_users", {
  id: serial("id").primaryKey(),
  clinicSlug: text("clinic_slug").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  status: text("status").notNull().default("Ativo"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";

export const clinicConveniosTable = pgTable("clinic_convenios", {
  id: serial("id").primaryKey(),
  clinicSlug: text("clinic_slug").notNull(),
  name: text("name").notNull(),
  code: text("code"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

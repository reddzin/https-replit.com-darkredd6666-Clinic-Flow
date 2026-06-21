import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";

export const appReviewsTable = pgTable("app_reviews", {
  id: serial("id").primaryKey(),
  clinicId: text("clinic_id").notNull(),
  ownerEmail: text("owner_email").notNull(),
  rating: integer("rating").notNull(),
  reviewText: text("review_text"),
  photoUrl: text("photo_url"),
  videoUrl: text("video_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

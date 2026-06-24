import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const subscriptionsTable = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  email: text("email").notNull(),
  caktoOrderId: text("cakto_order_id"),
  caktoRefId: text("cakto_ref_id"),
  caktoSubscriptionId: text("cakto_subscription_id"),
  planName: text("plan_name"),
  status: text("status").notNull().default("pending"),
  paidUntil: timestamp("paid_until"),
  canceledAt: timestamp("canceled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

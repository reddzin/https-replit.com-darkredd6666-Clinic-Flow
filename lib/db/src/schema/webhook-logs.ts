import { pgTable, serial, text, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const webhookLogsTable = pgTable("webhook_logs", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  caktoOrderId: text("cakto_order_id"),
  payload: jsonb("payload"),
  processed: boolean("processed").notNull().default(false),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

import { db, subscriptionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

export interface SubscriptionStatus {
  canAccess: boolean;
  status: string;
  paidUntil: Date | null;
}

export async function checkUserSubscription(email: string): Promise<SubscriptionStatus> {
  const [sub] = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.email, email.toLowerCase().trim()))
    .orderBy(desc(subscriptionsTable.createdAt))
    .limit(1);

  if (!sub) {
    return { canAccess: false, status: "no_subscription", paidUntil: null };
  }

  const now = new Date();
  const canAccess =
    sub.status === "active" && sub.paidUntil != null && sub.paidUntil > now;

  return {
    canAccess,
    status: sub.status,
    paidUntil: sub.paidUntil ?? null,
  };
}

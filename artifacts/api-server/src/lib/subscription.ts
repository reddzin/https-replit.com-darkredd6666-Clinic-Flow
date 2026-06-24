import { db, subscriptionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

export type PlanTier = "essencial" | "pro" | "supreme";

export interface PlanLimits {
  maxDoctors: number;
  maxAppointmentsPerMonth: number;
  listaEspera: boolean;
  lembrete30min: boolean;
  dashboardCompleto: boolean;
  multipleLinks: boolean;
  relatorioMensal: boolean;
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  essencial: {
    maxDoctors: 1,
    maxAppointmentsPerMonth: 30,
    listaEspera: false,
    lembrete30min: false,
    dashboardCompleto: false,
    multipleLinks: false,
    relatorioMensal: false,
  },
  pro: {
    maxDoctors: 5,
    maxAppointmentsPerMonth: Infinity,
    listaEspera: true,
    lembrete30min: true,
    dashboardCompleto: true,
    multipleLinks: false,
    relatorioMensal: false,
  },
  supreme: {
    maxDoctors: Infinity,
    maxAppointmentsPerMonth: Infinity,
    listaEspera: true,
    lembrete30min: true,
    dashboardCompleto: true,
    multipleLinks: true,
    relatorioMensal: true,
  },
};

export function detectPlanTier(planName: string | null | undefined): PlanTier {
  const name = (planName ?? "").toLowerCase();
  if (name.includes("supreme")) return "supreme";
  if (name.includes("essencial")) return "essencial";
  return "pro"; // default for Pro and any unrecognized
}

export interface SubscriptionStatus {
  canAccess: boolean;
  status: string;
  paidUntil: Date | null;
  planTier: PlanTier;
  planLimits: PlanLimits;
}

export async function checkUserSubscription(email: string): Promise<SubscriptionStatus> {
  const [sub] = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.email, email.toLowerCase().trim()))
    .orderBy(desc(subscriptionsTable.createdAt))
    .limit(1);

  if (!sub) {
    return {
      canAccess: false,
      status: "no_subscription",
      paidUntil: null,
      planTier: "essencial",
      planLimits: PLAN_LIMITS.essencial,
    };
  }

  const now = new Date();
  const canAccess =
    sub.status === "active" && sub.paidUntil != null && sub.paidUntil > now;

  const planTier = detectPlanTier(sub.planName);

  return {
    canAccess,
    status: sub.status,
    paidUntil: sub.paidUntil ?? null,
    planTier,
    planLimits: PLAN_LIMITS[planTier],
  };
}

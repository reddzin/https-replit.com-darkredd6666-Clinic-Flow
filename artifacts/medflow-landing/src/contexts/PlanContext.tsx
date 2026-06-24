import { createContext, useContext } from "react";

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

export const DEFAULT_LIMITS: PlanLimits = {
  maxDoctors: Infinity,
  maxAppointmentsPerMonth: Infinity,
  listaEspera: true,
  lembrete30min: true,
  dashboardCompleto: true,
  multipleLinks: true,
  relatorioMensal: true,
};

export interface PlanContextValue {
  planTier: PlanTier;
  planLimits: PlanLimits;
}

export const PlanContext = createContext<PlanContextValue>({
  planTier: "pro",
  planLimits: DEFAULT_LIMITS,
});

export function usePlan() {
  return useContext(PlanContext);
}

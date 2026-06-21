/** Converts a clinic display name to a URL-safe slug.
 *  "Clínica São Lucas" → "clinica-sao-lucas"
 */
export function generateSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export type Plan = "essencial" | "pro" | "supreme";

export interface BusinessHours {
  [day: string]: { active: boolean; open: string; close: string };
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  crm: string;
}

export interface ClinicSession {
  // Auth — set at /cadastro
  email: string;
  token: string;
  userName: string;
  initialClinicName: string;

  // Plan — set at /cadastro/planos
  plan?: Plan;

  // Payment — set at /cadastro/pagamento
  paymentConfirmed?: boolean;

  // Clinic details — set at onboarding step 2
  clinicName: string;
  clinicSlug: string;
  clinicAddress?: string;
  clinicPhone?: string;
  clinicCity?: string;
  clinicState?: string;
  logoUrl?: string;

  // Onboarding
  onboarding_completed: boolean;
  clinicType?: string;
  businessHours?: BusinessHours;
  doctors?: Doctor[];
  appointmentDuration?: number;
}

const STORAGE_KEY = "medflow_user";

export function getSession(): ClinicSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ClinicSession;
  } catch {
    return null;
  }
}

export function saveSession(data: Partial<ClinicSession>): void {
  const current = getSession() ?? ({} as ClinicSession);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...data }));
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// ── Legacy aliases (keep existing callers working) ──────────────────────────
export type ClinicData = ClinicSession;
export const getClinicData = getSession;
export function saveClinicData(data: Partial<ClinicSession>): void {
  saveSession(data);
}

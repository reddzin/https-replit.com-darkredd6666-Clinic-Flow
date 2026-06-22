const PATIENT_KEY = "medflow_patient";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export interface PatientSession {
  token: string;
  id: number;
  name: string;
  email: string;
  phone: string | null;
  expiresAt?: number;
}

export function getPatientSession(): PatientSession | null {
  try {
    const raw = localStorage.getItem(PATIENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PatientSession;
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      localStorage.removeItem(PATIENT_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function savePatientSession(data: PatientSession): void {
  const expiresAt = (data as PatientSession).expiresAt ?? Date.now() + SESSION_DURATION_MS;
  localStorage.setItem(PATIENT_KEY, JSON.stringify({ ...data, expiresAt }));
  window.dispatchEvent(new Event("medflow:patient-updated"));
}

export function clearPatientSession(): void {
  localStorage.removeItem(PATIENT_KEY);
  window.dispatchEvent(new Event("medflow:patient-updated"));
}

export function getPatientToken(): string | null {
  return getPatientSession()?.token ?? null;
}

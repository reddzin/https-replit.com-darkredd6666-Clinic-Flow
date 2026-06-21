const PATIENT_KEY = "medflow_patient";

export interface PatientSession {
  token: string;
  id: number;
  name: string;
  email: string;
  phone: string | null;
}

export function getPatientSession(): PatientSession | null {
  try {
    const raw = localStorage.getItem(PATIENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PatientSession;
  } catch {
    return null;
  }
}

export function savePatientSession(data: PatientSession): void {
  localStorage.setItem(PATIENT_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("medflow:patient-updated"));
}

export function clearPatientSession(): void {
  localStorage.removeItem(PATIENT_KEY);
  window.dispatchEvent(new Event("medflow:patient-updated"));
}

export function getPatientToken(): string | null {
  return getPatientSession()?.token ?? null;
}
